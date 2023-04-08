import React from "react";
import Home from "../Module/Home";
import Auth from "../Module/Auth"
import CreatePost from "../Module/CreatePost";
import {Navigate, Route, Routes as Router} from 'react-router-dom';
import Profile from "../Module/Profile";
import Userprofile from "../Module/Userprofile";
import Profileimage from "../Module/Profileimage";
import Setting from "../Module/Settings";
import Post from "../Module/Post";

const PrivateRouting = ({children})=>{
    const isUserLoggedIn = window.localStorage.getItem('user:token') || false;
    const isAuthPages = window.location.pathname.includes('login') || window.location.pathname.includes('signup')
    if (!isUserLoggedIn && isAuthPages) {
        return children;
    } else if(isUserLoggedIn && !isAuthPages){
        return children;
    }
    else{
        return <Navigate to="/login" replace/>;
    }
}
const Routes = () => {
return(
<Router>
<Route path='/' element={<PrivateRouting> <Home/> </PrivateRouting> } />
<Route path="/createpost" element={<PrivateRouting><CreatePost/></PrivateRouting>}/>
<Route path='/login' element={<PrivateRouting> <Auth/> </PrivateRouting>} />
<Route path='/signup' element={<PrivateRouting> <Auth/> </PrivateRouting>} />
<Route path="/profile" element={<PrivateRouting><Profile/></PrivateRouting>}/>
<Route path="/:username" element={<PrivateRouting><Userprofile/></PrivateRouting>}/>
<Route path="/profileimageupload" element={<PrivateRouting><Profileimage/></PrivateRouting>}/>
<Route path="/setting" element={<PrivateRouting><Setting/></PrivateRouting>}/>
<Route path="/post/:post_id" element={<PrivateRouting><Post/></PrivateRouting>}/>


</Router>

)}

 export default Routes;