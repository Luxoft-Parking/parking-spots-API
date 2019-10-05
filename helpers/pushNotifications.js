const debug = require('debug')('pushNotifications');
const err = debug.extend('error');
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

function getTokensForUsers(users) {
  return users.reduce(
    (tokens, user) => {
      const token = `ExponentPushToken[${user.expoToken}]`;

      if (Expo.isExpoPushToken(token)) {
        tokens[0].push(token);
        tokens[1].push(user.fullName.split(' ')[0]);
      }
      return tokens;
    },
    [[], []]);
}

module.exports.sendFreeParkingNotifications = async function (users, spotId) {

  let [tokens, names] = getTokensForUsers(users);
  let messages = tokens.map(
    (token, index) => ({
      to: token,
      data: { spotId },
      title: `Hi ${names[index]}! A spot in La Perla is now free!`,
      body: 'Would you like to try to use it today?',
      ttl: 3600,
      _displayInForeground: true,
      channelId: 'Freed Spots'
    })
  );
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  let receiptIds = [];

  debug('chunks: ', chunks);

  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

      debug({ ticketChunk });
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
    } catch (error) {
      err(error);
    }
  }

  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

  // Like sending notifications, there are different strategies you could use
  // to retrieve batches of receipts from the Expo service.
  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

      debug({ receipts });

      // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.
      for (let receipt in receipts) {
        if (receipt.status === 'ok') {
          continue;
        } else if (receipt.status === 'error') {
          err(`There was an error sending a notification: ${receipt.message}`);
          if (receipt.details && receipt.details.error) {
            // The error codes are listed in the Expo documentation:
            // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
            // You must handle the errors appropriately.
            err(`The error code is ${receipt.details.error}`);
          }
        }
      }
    } catch (error) {
      err(error);
    }
  }
};
