// const {check} = require('validator');

// var nodemailer = require('nodemailer');
// const otpGenerator = require('otp-generator')

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'mayurpimpude@gmail.com',
//         pass: 'gnqpsgbfrlikqhcp'
//     }
// });

// try {
//     const otpp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
//     console.log(otpp);

//     const mailOptions = {
//         from: 'mayurpimpude@gmail.com', // sender age
//         to: 'mayurpimpude@gmail.com', // list of receivers
//         subject: 'Verification code', // Subject line
//         html: `
//         <body style="background-color:#f8e3c8;padding:4%">
//         <div style="font-size:18px;text-align:center;margin-bottom:4%">logo</div>
//         <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:18px;text-align:center">Hello,<br>Below is your one time passcode:</div>
//         <div style="text-align:center;padding:4%"><button style="background:white;border-radius:5px;border: none;padding: 15px 32px;text-align: center;font-size:25px"><b style="font-family:Graduate;letter-spacing:4px">${otpp}</b></button></div>
//         <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:18px;text-align:center">If you didn't requested this,you can ignore or let us know.<br>-Snowflake team</div>
//         </body>`
//     };

//     transporter.sendMail(mailOptions, function (err, info) {
//         if (err)
//             console.log(err)
//         else
//             console.log(info);
//     })
// }
// catch (error) {
//     console.log(error);
//     return false;
// }
const message = 'Passwords Not Matching'
console.log(message.length);

const message2 = 'Password Reset Successful !'
console.log(message2.length);

// const mongoose = require('mongoose');
  
// // Database connection
// mongoose.connect('mongodb://127.0.0.1:27017/geeksforgeeks')
  
// // User model
// const User = mongoose.model('User', {
//     name: { type: String },
//     age: { type: Number }
// });

// console.log("connected to mongodb !");

// var nam = 'mayur';
// User.deleteMany({ name : nam }).then(function(){
//     console.log("Data deleted"); // Success
// }).catch(function(error){
//     console.log(error); // Failure
// });

// try {
//     var myquery = { name: "mayur" };
//     var newvalues = { $set: {age: "21" } }
//     User.updateOne(myquery,newvalues,function(err, res) {
//              if (err) throw err;})
//     console.log('value updated successfully');
// } catch (error) {
//     console.log(error);
// }

// var myquery = { name: "mayur" };
// var newvalues = { $set: {age: "18" } };
//   User.updateOne(myquery, newvalues, function(err, res) {
//     if (err) throw err;
//     console.log("1 document updated");
//   })
