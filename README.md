
# Sociomeet
https://sociomeet2.netlify.app/login 
### A Social Media Website



## Features
- Signup / Signin
- Search Implemented
- Upload a Profile picture (click on profile pic in profile page)
- Like / Unlike Posts
- view Post (click on post)
- Comment on Posts
- View comments of other user (on Post page)
- View who liked the Posts (on clicking number of likes) 
- Caption for Post
- Follow / Unfollow other users
- View who is your/otherUser followers and following 
- Save Posts (show on your profile only to you)
- Delete Post
- Change password
- Change/Add bio
- Change Name
## How to Run
#### Add .env file at Backend which contains Database connection key.
#### You need some packages at Backend

```bash
  npm i express nodemon mongoose cookie-parser bcryptjs jsonwebtoken cors dotenv
```
#### You need some packages at Frontend

```bash
  npm i cors react-spinners
```
#### To run this project 
At Frontend
```bash
  npm start
```
At Backend
```bash
  nodemon .\app.js
```
