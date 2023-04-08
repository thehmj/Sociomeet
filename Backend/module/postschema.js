const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');
const postschema = new moongose.Schema({
    caption: {
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true,
        unique: true
    },
    userId:{
        type : moongose.Schema.Types.ObjectId ,
        ref:'USER',
        required: true
    },
    like:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:'USER'      
    }],
    comments:[
        {
            commentor:{
                type: moongose.Schema.Types.ObjectId,
                ref: 'USER'
            },
            comment:{
                type: String
            }

        }
    ]
})

const Posts = new moongose.model("POST", postschema);
module.exports =  Posts;