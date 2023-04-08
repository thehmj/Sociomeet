const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
username:{
    type: String,
    required: true,
    unique: true
}, 
Name:{
    type: String,
    required: true,
}, 
email:{
    type: String,
    required: true,
    unique: true
}, 
password:{
    type: String,
    required: true,
},
Pimage:{
    type: String,
    default: "https://res.cloudinary.com/dybpftiua/image/upload/v1680791618/uxolxvvtul2eavud8qtb.png"
},
bio:{
    type: String
},
Savepost:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'POST'
    }
]

})

const Users = new mongoose.model("USER",userSchema);
module.exports = Users;


