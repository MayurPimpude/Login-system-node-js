const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const RegistrationSchema = new mongoose.Schema({
    Name:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        unique:true
    },
    confirmpassword:{
        type:String,
        require:true
    }
})

RegistrationSchema.pre("save",async function(next){
    this.password = await bcrypt.hash(this.password,10);
    this.confirmpassword=undefined;
    next();
})

const Register = new mongoose.model("Register",RegistrationSchema);

module.exports = Register;