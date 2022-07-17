const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
var nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const UserOTPVerification = require('./models/o');
require('dotenv').config();

var session = require('express-session')
app.use(session({
    secret:'login',
    cookie:{maxAge:6000},
    saveUninitialized:false,
    resave:false
})); 
app.use(require('flash')());

const port = process.env.PORT || 3000;
require("./db/conn");

const Register = require("./models/register");
const { verify } = require('crypto');
const { nextTick } = require('process');
const { Console } = require('console');

//const static_path = path.join(__dirname,"../public");
//app.use(express.static(static_path));
//console.log(path.join(__dirname,"../views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('views', path.join(__dirname, '../views'))
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index",{message});
});

app.get("/register", (req, res) => {
    const message = req.flash('success')
    res.render("index",{message});
});

app.get("/login", (req, res) => {
    const message = req.flash('warning')
    res.render("login",{message});
});

app.get("/otp", (req, res) => {
    const message = req.flash('warning')
    res.render("otp",{message});
});

app.get("/forgetPassword", (req, res) => {
    const message = req.flash('warning')
    res.render("forget",{message});
});

app.get("/resetPassword", (req, res) => {
    const message = req.flash('warning')
    res.render("reset",{message});
});

app.get("/otpVerify", (req, res) => {
    const message = req.flash('warning')
    const success = req.flash('success')
    res.render("forget",{message,success});
});

app.post("/register", async (req, res) => {
    try {
        // console.log(req.body.name);
        // res.send(req.body.name);

        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if (password === cpassword) {
            const register = new Register({
                Name: req.body.name,
                email: req.body.email,
                password: password,
                confirmpassword: cpassword
            })

            const registered = await register.save();
            res.render("index",{message:'Registration Successful'});

        } else {
            res.render("index",{message:'Passwords Not Matching'});
        }

    } catch (error) {
        res.status(400).send(error);
    }
})

let gobalemail="";

app.post("/login", async (req, res) => {
    try {
        let email = req.body.lemail;
        const lpassword = req.body.lpassword;
        const useremail = await Register.findOne({ email: email });

        if(useremail==null){
           // return res.status(400).send('invalid email')
            return res.render("login",{message:'Invalid Credentials !'})
        }

        const isMatch = await bcrypt.compare(lpassword, useremail.password);

        if ((isMatch) && (useremail!==null)) {
            Emailsender(email);
      
             gobalemail=email;
             const message = req.flash('warning')
             res.render('otp',{email:email,message});
            
        }
        else {
           
            res.render("login",{message:'Invalid Credentials !'});
        }
        

    } catch (error) {
        // res.render("login",{message:'Invalid Credentials !'});
        res.status(400).send(error)
    }
})

app.post("/otp", async (req, res) => {
    try {
        const otp1 = req.body.number;
        console.log(otp1);
            const OTPRecord = await UserOTPVerification.find({
                userId:gobalemail,
            });
        console.log(gobalemail);
            if (OTPRecord.length<=0) {
                console.log('otp in record empty');
                res.render("otp",{message:'OTP in record empty'});
               // res.send('otp in record empty');
            } else {
                const isMatch = await bcrypt.compare(otp1, OTPRecord[0].otp);

                if (isMatch) {
                    console.log('Login');
                    res.send('Login');
                    const del = await UserOTPVerification.deleteOne({userId:gobalemail});
                    console.log(del);
                    console.log('data deleted')
                }
                else{
                    const del = await UserOTPVerification.deleteOne({userId:gobalemail});
                    console.log(del);
                    console.log('data deleted')
                    res.render("otp",{message:'Invalid OTP please try again after 2 mins'});
                    //res.send('Invalid otp');
                }
             }
            
    } catch (error) {
        console.log('yo3');
        console.log(error);
    }
})

let gobalemail2='';

app.post("/forgetPassword", async (req, res) => {
    gobalemail2 = req.body.femail;
    console.log(req.body.femail);
    Emailsender(req.body.femail);
})

app.post("/otpVerify", async (req, res) => {
    try {
        const otp1 = req.body.number;
        console.log(otp1);
            const OTPRecord = await UserOTPVerification.find({
                userId:gobalemail2,
            });
        console.log(gobalemail2);
            if (OTPRecord.length<=0) {
                console.log('otp in record empty');
                res.render("forget",{message:'OTP in record empty'});
               // res.send('otp in record empty');
            } else {
                const isMatch = await bcrypt.compare(otp1, OTPRecord[0].otp);

                if (isMatch) {
                    res.redirect('resetPassword');
                    const del = await UserOTPVerification.deleteMany({userId:gobalemail2});
                    console.log(del);
                    console.log('data deleted')
                }
                else{
                    const del = await UserOTPVerification.deleteMany({userId:gobalemail2});
                    console.log(del);
                    console.log('data deleted')
                    res.render("forget",{message:'Invalid OTP please try again after 2 mins'});
                    //res.send('Invalid otp');
                }
             }
            
    } catch (error) {
        console.log('yo9');
        console.log(error);
    }
})

app.post("/resetPassword", async (req, res) => {
    try {
        console.log(gobalemail2);
        const password = req.body.pass;
        const cpassword = req.body.cpass;

        var myquery = { email: gobalemail2 };
        var newvalues = { $set: {password: req.body.pass } }

        if (password === cpassword) {
            const reset = await Register.findOne({ email: gobalemail2 });
            reset.password = req.body.pass
            await reset.save();
            
            res.render("reset",{message:'Password Reset Successful !'});

        } else {
            res.render("reset",{message:'Passwords Not Matching'});
        }
    } catch (error) {
        console.log('yo55')
        console.log(error)
    }
    
})

async function Emailsender(email){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gmail address',
                pass: 'secret key'
            }
        });
    
        try {
            let otpp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
            console.log(otpp);
    
            const mailOptions = {
                from: 'gmail address', // sender address
                to: email, // list of receivers
                subject: 'Verification code', // Subject line
                html: `
                <body style="background-color:#f8e3c8;padding:4%">
                <div style="text-align:center;margin-bottom:4%;"><h2><strong>Even-tual</strong></h2></div>
                <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:18px;text-align:center">Hello,<br>Below is your one time passcode:</div>
                <div style="text-align:center;padding:4%"><button style="background:white;border-radius:5px;border: none;padding: 15px 32px;text-align: center;font-size:25px"><b style="font-family:Graduate;letter-spacing:4px">${otpp}</b></button></div>
                <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:18px;text-align:center">If you didn't requested this,you can ignore or let us know.<br>-Team Eventual</div>
                </body>`
            };

            const saltRounds = 10;
            const HashedOtp = await bcrypt.hash(otpp,saltRounds);
            const newOTPVerification = new UserOTPVerification({
                userId: email,
                otp: HashedOtp,
                createdAt :Date.now(),
                expireAt: Date.now() + 3600000,
            });
            await newOTPVerification.save();
    
            transporter.sendMail(mailOptions, function (err, info) {
                if (err){
                    console.log('yo1');
                    console.log(err)
                }
                else
                    console.log(info);
            });
        
    } catch (error) {
        console.log('error in sending email');
        console.log(error);
    }
}

app.listen(port, () => {
    console.log("server is active on " + port);
})

