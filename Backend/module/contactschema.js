const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
followby:{
 type: mongoose.Schema.Types.ObjectId,
 required: true,
 ref: 'USER'
},
following:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
   ref:'USER'
}
})

const Contact = new mongoose.model("CONTACT",contactSchema);
module.exports = Contact;
