const Spot = require('../../models/ParkingSpot');
const User = require('../../models/User');
const { take, takeRight, pick, nth, slice } = require('lodash');
const moment = require('moment');

module.exports = {
  get: {
    handler: async function calculateRotation(request, h) {
      const usersWithParking = await User.find({ active: true, isDriver: true, hasParkingSpot: true }, '-_id fullName reputation spot.level spot.number').sort({ reputation: -1, startDate: -1 }).lean();
      const usersWithoutParking = await User.find({ active: true, isDriver: true, hasParkingSpot: false }, '-_id fullName reputation').sort({ reputation: -1, startDate: 1 }).lean();
      const totalSpaces = await Spot.estimatedDocumentCount();
      const totalUsers = await User.countDocuments({ active: true, isDriver: true });
      let rotationCount = totalUsers - totalSpaces;
      let everyone = [...usersWithoutParking, ...usersWithParking];
      const nextWithParking = take(everyone, totalSpaces);
      const nextWithoutParking = takeRight(everyone, rotationCount);

      return h.response({ currentRole: { usersWithParking, usersWithoutParking }, nextRole: { nextWithParking, nextWithoutParking } }).code(200);
    },
    config: {
      auth: {
        scope: ['admin']
      }
    }
  },
  post: {
    handler: async function applyRotation(request, h) {
      const TODAY = moment().millisecond(0).second(0);
      const usersWithParking = await User.find({ active: true, isDriver: true, hasParkingSpot: true }, 'fullName reputation spot').sort({ reputation: -1, startDate: -1 });
      const usersWithoutParking = await User.find({ active: true, isDriver: true, hasParkingSpot: false }, 'fullName reputation').sort({ reputation: -1, startDate: 1 });
      const totalSpaces = await Spot.estimatedDocumentCount();
      const assignedSpaces = await Spot.countDocuments({ isFree: false });
      const freeSpaces = totalSpaces - assignedSpaces;
      const toReassign = usersWithoutParking.length - freeSpaces;

      await User.updateMany({ hasParkingSpot: true }, { reputation: 0 });

      console.log(`Rotation: Total Spaces: ${totalSpaces} Free spaces: ${freeSpaces} Users with spot: ${usersWithParking.length} Users without spot: ${usersWithoutParking.length} Spots to reassign: ${toReassign}`);
      // First, let's use up all the free spots
      for (let i = 0; i < freeSpaces; i++) {
        const spot = await Spot.findOne({ isFree: true });
        const user = usersWithoutParking[i];

        spot.isFree = false;
        spot.usedBy = null;
        spot.assignedUser = usersWithoutParking[i].id;

        user.spot = spot;
        user.hasParkingSpot = true;
        user.startDate = TODAY;
        await spot.save();
        await user.save();
      }

      // Then, let's reassign the last used spots to the following users
      let assignedIndex = -1;

      // Start reassigning after `freeSpaces` up to the last driver without spot
      for (const user of slice(usersWithoutParking, freeSpaces, toReassign)) {
        // Take the nth to last of the assigned users
        const previousOwner = nth(usersWithParking, assignedIndex--);
        let spot;

        if (previousOwner && previousOwner.spot) {
          spot = await Spot.findById(previousOwner.spot.id);
          // This driver will loose her spot and start building reputation from now on
          previousOwner.spot = null;
          previousOwner.hasParkingSpot = false;
          previousOwner.startDate = TODAY;
          previousOwner.reputation = 0;
          await previousOwner.save();
        } else {
          // This only happens if we had more places than previously assigned drivers
          spot = await Spot.findOne({ isFree: true });
        }
        user.spot = spot;
        user.hasParkingSpot = true;
        user.startDate = TODAY;
        spot.assignedUser = user.id;
        spot.isFree = false;
        spot.usedBy = null;
        await user.save();
        await spot.save();

      }
      return h.response().code(200);
    }
  }
};
