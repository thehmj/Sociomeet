import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Styles/Auth.css'

import Signin from "../Components/Signin";
import Signup from "../Components/Signup";

function Auth() {
    const [checked, setChecked] = useState(false);
    const handleChange = () => {
      setChecked(!checked);
    }
    const navigate = useNavigate();
    console.log(checked);
    const [data,setData] = useState({
      ...(checked && {username:'',Name:''}),
      email : '',
      password: ''

    });
   console.log(data,'data');
    return(
    <div className="signin">
    <div className='signin_title'>Sociomeet</div>
        <div className="login">
       <div className='change_page'> <h3> {checked=== true ? "Slide to LOGIN":" Slide to REGISTER"}</h3>
        
        <label class="switch">   
          <input
            type="checkbox"
            checked={checked}
            id="check_id"
            onChange={handleChange}
            onClick={()=> navigate(`${checked ? '/login':'/signup' }`)}
            />
    <span class="slider round"></span>
  </label></div>
        <h1 style={{color:"white"}}> {checked=== false ? "LOGIN":"REGISTER"}</h1>
  
            {checked=== false ? <Signin data={data} setData={setData} /> : <Signup  data={data} setData={setData} setChecked={setChecked}  />}
            <a className="feedback" href = "mailto:royalhmj@gmail.com?subject = Feedback" >
Send Feedback
</a>
    </div>
    </div>
        )
  }
  
  export default Auth;