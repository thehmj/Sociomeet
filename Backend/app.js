const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('./connection');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const Users = require('./module/userSchema');
const Posts = require('./module/postschema');
const Contact = require('./module/contactschema');

const requirelogin = require('./Middleware/requiredlogin');

const port = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('hello programmer');
})

app.post('/api/register', async (req, res, next) => {
    try {
        const { username, Name, email, password } = req.body;
        if (!username || !Name || !email || !password) {
            res.status(400).send('cannot be empty')
        }
        const isExists = await Users.findOne({ email: email }) || await Users.findOne({ username: username })
        if (isExists) {
            console.log('user exist');
            res.status(401).send('User already exists');

        } else {
            const user = await new Users({
                email: email,
                username: username,
                Name: Name
            })
            bcryptjs.hash(password, 10, (err, hashedpassword) => {
                if (err) next(err)
                user.set('password', hashedpassword);
                user.save();
                res.status(200).send('sucessfully registered.');
            })


        }
    } catch (error) {
        res.status(500).send('Server error')
        // console.log(error, 'error');
    }
})

app.post('/api/login', async (req, res, next) => {
    try {
        console.log('hitt');
        const { email, password } = await req.body;
        if (!email || !password) {
            res.status(400).send('cannot be empty')
        }
        const user = await Users.findOne({ email });
        if (!user) {
            res.status(401).send('Invalid user or password');
        } else {
            const validate = await bcryptjs.compare(password, user.password);
            if (!validate) {
                res.status(401).send('Invalid user or password');
            } else {
                const payload = {
                    id: user._id,
                    username: user.username
                }
                const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'himanshu@46'
                jwt.sign(
                    payload,
                    JWT_SECRET_KEY,
                    { expiresIn: 864000 },
                    (err, token) => {
                        if (err) { res.json({ message: err }) }
                        else {
                            return res.status(200).json({ user, token })
                        }
                    }
                )
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

app.post('/api/createpost', requirelogin, async (req, res) => {
    try {
        const { caption, url } = req.body;
        const { user } = req;
        const [mid] = user;
        if (!url) {
            return res.status(400).send("Cannot be empty");
        }
        const Createpost = new Posts({
            caption: caption,
            url: url,
            userId: mid
        })

        const a = await Createpost.save();
        res.status(200).send("Successfully posted");

    } catch (error) {

        res.status(500).send("error" + error);
    }
})

app.get('/api/profile', requirelogin, async (req, res) => {
    try {
        const { user } = req;
        const [user_object] = user
        const posts = await Posts.find({ userId: user }).sort({ '_id': -1 });
        const following = await Contact.find({ followby: user }).populate("following", "_id username Name Pimage");
        const follower = await Contact.find({ following: user }).populate("followby", "_id username Name Pimage");
        const [usersaveposts] = await Users.find({ _id: user_object._id }).populate("Savepost", " _id caption url like comments");
        console.log(usersaveposts);
        res.status(200).json({ posts, user: usersaveposts, follower, following });
    } catch (error) {
        res.status(500).send(error);
    }
})
app.get('/api/user', requirelogin, async (req, res) => {
    try {
        const { username } = req.query;
        const { user: followby } = req;
        const [myself] = followby;
        console.log(username);
        if (username === myself.username) {
            return res.status(404).send('not found')
        }
        const [user] = await Users.find({ username: username })
        const posts = await Posts.find({ userId: user._id }).sort({ '_id': -1 })
        // console.log(user._id, myself._id);
        const [isFollowed] = await Contact.find({ followby: myself._id, following: user._id })
        const UserDetails = {
            id: user._id,
            username: user.username,
            Name: user.Name,
            Pimage : user.Pimage
        }
        const following = await Contact.find({ followby: user }).populate("following", "_id username Name Pimage");
        const follower = await Contact.find({ following: user }).populate("followby", "_id username Name Pimage");
        res.status(200).json({ posts, UserDetails, isFollowed: !!isFollowed, following, follower });

    } catch (error) {
        res.status(500).send(error);
    }
})

app.get('/api/homeposts', requirelogin, async (req, res) => {
    try {
        const { user } = req;
        const posts = await Posts.find().populate("userId", "_id username Name Pimage").populate("like", "_id username Name Pimage").sort({ '_id': -1 })
        // console.log(user);
        res.status(200).json({ posts, user });

    } catch (error) {
        res.status(500).send(error);
    }
})
app.post('/api/follow', requirelogin, async (req, res) => {
    try {
        const { id } = req.body;
        const { user } = req;
        const [followby] = user;
        if (!id) {
            return res.status(400).send('cannot be empty');
        }
        const [following] = await Users.find({ _id: id })
        const contact = new Contact({
            followby: followby,
            following: following
        })
        // console.log(contact,"contact");
        await contact.save();
        res.status(200).json({ isFollowed: true });
    } catch (error) {
        res.status(500).send(error);
    }
})
app.delete('/api/unfollow', requirelogin, async (req, res) => {
    try {
        const { followid } = req.body;

        const { user } = req;
        const [followby] = user;

        if (!followid) {
            return res.status(400).send('cannot be empty');
        }
        // console.log(user._id, 'followby');
        await Contact.deleteOne({ followby: followby._id, following: followid });

        res.status(200).json({ isFollowed: false });
    } catch (error) {
        res.status(500).send(error);
    }
})

app.delete('/api/deletepost', requirelogin, async (req, res) => {
    try {
        const { postid } = req.body;
        const { user } = req;
        const [mid] = user;


        if (!postid) {
            return res.status(400).send('cannot be empty');
        }
        const check = await Posts.findOne({ _id: postid });
        console.log(check.userId);
        console.log(mid._id);
        if (!check.userId.equals(mid._id)) {
            return res.status(401).send('delete access not permitted');
        }
        await Posts.deleteOne({ _id: postid, userId: mid._id })
        res.status(200).json('post deleted');
    } catch (error) {
        res.status(500).send(error);
    }
})

app.post('/api/like', requirelogin, async (req, res) => {
    try {
        const { postid } = req.body;
        const { user } = req;
        const [mid] = user;
        console.log(postid, 'reqbody');
        console.log(mid);
        if (!postid) {
            return res.status(400).send('cannot be empty');
        }
        const postliked = await Posts.findOneAndUpdate({ _id: postid }, {
            $push: { like: mid._id }
        }, { returnDocument: "after" }).populate("userId", "_id username Name Pimage").populate("comments.commentor", "_id username Name Pimage").populate("like", "_id username Name Pimage");
        console.log(postliked);
        res.status(200).json({ postliked });

    } catch (error) {
        res.status(500).send(error);
    }
})

app.delete('/api/unlike', requirelogin, async (req, res) => {
    try {
        const { postid } = req.body;
        const { user } = req;
        const [mid] = user;
        if (!postid) {
            return res.status(400).send('cannot be empty');
        }
        const postliked = await Posts.findOneAndUpdate({ _id: postid }, {
            $pull: { like: mid._id }
        }, { returnDocument: "after" }).populate("userId", "_id username Name Pimage").populate("comments.commentor", "_id username Name Pimage").populate("like", "_id username Name Pimage");
        console.log(postliked);
        res.status(200).json({ postliked });

    } catch (error) {
        res.status(500).send(error);
    }
})

app.post('/api/profileimageupload', requirelogin, async (req, res) => {
    try {
        const [user] = req.user;
        const { url } = req.body;
        console.log(user._id, 'user');
        console.log(url, 'url');
        const profileimageupload = await Users.findOneAndUpdate({ _id: user._id }, {
            Pimage: url
        });
        console.log(profileimageupload);
        res.status(200).send('profile image uploaded');
    } catch (error) {
        res.status(500).send(error);
    }

})

app.post('/api/updatebio', requirelogin, async (req, res) => {
    try {

        const [user] = req.user;
        const { bio } = req.body;
        const updatebio = await Users.findOneAndUpdate({ _id: user._id }, {
            bio: bio
        });
        console.log(updatebio);
        res.status(200).send('bio updated');
    } catch (error) {
        res.status(500).send(error);
    }

})

app.get('/api/post', requirelogin, async (req, res) => {
    try {
        const { post_id } = req.query;
        // console.log('here');
        const [user] = req.user;
        if (!post_id) {
            return res.status(404).send('postid is not found')
        }
        const postdetails = await Posts.findOne({ _id: post_id }).populate("userId", "_id username Name Pimage").populate("comments.commentor", "_id username Name Pimage").populate("like", "_id username Name Pimage");

        res.status(200).json({ postdetails, user });

    } catch (error) {
        res.status(500).send(error);

    }
})

app.post('/api/postcomment', requirelogin, async (req, res) => {
    try {

        const { comment, postid } = req.body;
        const [user] = req.user;

        const postedcomment = await Posts.findOneAndUpdate({ _id: postid }, {
            $push: {
                comments: {
                    commentor: user._id,
                    comment: comment
                }
            }
        }, { returnDocument: "after" }).populate("userId", "_id username Name Pimage").populate("comments.commentor", "_id username Name Pimage").populate("like", "_id username Name Pimage");
        // console.log('here os', postedcomment);

        res.status(200).json({ postedcomment });
    } catch (error) {
        res.status(500).send(error);
    }

})

app.post('/api/savethispost', requirelogin, async (req, res) => {
    try {
        const { postid } = req.body;
        const [user] = req.user;
        console.log('user', user, 'postid', postid);

        const userpostsaved = await Users.findOneAndUpdate({ _id: user }, {
            $push: {
                Savepost: postid
            }
        }, { returnDocument: "after" });

        // console.log('here os', userpostsaved);

        res.status(200).json({ userpostsaved });
    } catch (error) {
        res.status(500).send(error);
    }

})

app.post('/api/unsavethispost', requirelogin, async (req, res) => {
    try {
        const { postid } = req.body;
        const [user] = req.user;
        console.log('user', user, 'postid', postid);

        const userpostunsaved = await Users.findOneAndUpdate({ _id: user }, {
            $pull: {
                Savepost: postid
            }
        }, { returnDocument: "after" });

        // console.log('here os', userpostunsaved);

        res.status(200).json({ userpostunsaved });
    } catch (error) {
        res.status(500).send(error);
    }

})

app.post('/api/search', requirelogin, async (req, res) => {
    const { search } = req.body;
    const regex = new RegExp(search, 'i');
    const searchresult = await Users.find({
        $or: [{ Name: regex }, { username: regex }]
    });
    res.status(200).json({ searchresult });
})

app.post('/api/updatename', requirelogin, async (req, res) => {
    try {

        const [user] = req.user;
        const { Name } = req.body;
        if (!Name) {
            return res.status(401).send('not found')
        }
        const updateName = await Users.findOneAndUpdate({ _id: user._id }, {
            Name: Name
        });
        console.log(updateName);
        res.status(200).send('Name updated');
    } catch (error) {
        res.status(500).send(error);
    }

})
app.post('/api/updatepassword', requirelogin, async (req, res) => {
    try {

        const [user] = req.user;
        const { password } = req.body;
        if (!password) {
            return res.status(401).send('not found')
        }
        const protectedpassword = await bcryptjs.hash(password, 10);
        const updatepassword = await Users.findOneAndUpdate({ _id: user._id }, {
            password: protectedpassword
        });
        console.log(updatepassword);
        res.status(200).send('password updated');
    } catch (error) {
        res.status(500).send(error);
    }

})


app.listen(port, () => {
    console.log('server is running....');
})