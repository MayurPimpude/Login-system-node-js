const mongoose = require('mongoose');

const UserOTPVerificationSchema = new mongoose.Schema({
    userId:String,
    otp:String,
    createdAt: Date,
    expireAt: Date,
},{expireAfterSeconds: 100});

const UserOTPVerification = new mongoose.model(
    "UserOTPVerification",
    UserOTPVerificationSchema
);

module.exports = UserOTPVerification;