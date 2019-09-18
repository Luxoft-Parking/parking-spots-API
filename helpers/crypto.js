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
const a = module.exports.cipherData('48e5c1351cbb909217e4b0123ca4e4143b2f76353b5a50793bd1020ae51c30ae');
console.log(`encrypted: _${a}_`);
const b = module.exports.decipherData('4a2bca8e7c7a5cecf616f11e5d3d7fa051208e6675015ba2c474da943380a665baa71f3c6cf94854f087fd7c33312a1630443eec2b845c267e5b10669f96d3cbfa330effe17b3c08e97c6fee928edd9e60816fc52d6d60bb5ec473bf977f0e50');
console.log(`decrypted: _${b}_`);
