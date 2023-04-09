import { useNavigate } from 'react-router-dom';
import '../Styles/Home.css';
import homepng from '../images/home.png';
import createpostpng from '../images/add.PNG';
import profilepng from '../images/user.png';
import logoutpng from '../images/switch.png';
import settingpng from '../images/setting.png';
// import { useState } from 'react';



const Nav = ()=>{
    const navigate = useNavigate();
   

    const logout =()=>{
        localStorage.removeItem('user:token');
        return navigate('/login');
    }


return(
    <nav className='nav'>
       <div className='nav_title'onClick={()=>navigate('/')}  >Sociomeet</div>
      
       <div className='nav_buttons'>
        <img onClick={()=>navigate('/')} src={homepng} alt="loading" />
     
        <img src={createpostpng}  onClick={()=>navigate('/createpost')} alt="loading" />
       
        <img src={profilepng}  onClick={()=>navigate('/profile')}alt="loading" />
      
        <img src={settingpng}  onClick={()=>navigate('/setting')}alt="loading" />
   
        <img  onClick={()=>logout()} src={ logoutpng} alt="" />
     

        </div>
    </nav>
)

}

export default Nav;
