const crypto=require('crypto')

exports.generateResetToken = () =>
  crypto.randomBytes(32).toString("hex");