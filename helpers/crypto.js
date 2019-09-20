const crypto = require('crypto');
const algorithm = 'aes-192-cbc';
const password = 'ab@AFS9Fg_4%qbP>:FamD/Xq';
// Use the async `crypto.scrypt()` instead.

module.exports.cipherData = function (data) {
  // Use `crypto.randomBytes` to generate a random iv instead of the static iv
  // shown here.

  const key = crypto.scryptSync(password, 'salt', 24);
  const iv = crypto.randomBytes(16); // Initialization vector.
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');

  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}${encrypted}`;
};

module.exports.decipherData = function (data) {

  const key = crypto.scryptSync(password, 'salt', 24);
  const iv = Buffer.from(data.substring(0, 32), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(data.substring(32), 'hex', 'utf8');

  decrypted += decipher.final('utf8');
  return decrypted;
};
