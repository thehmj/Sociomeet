import { useNavigate } from "react-router-dom";

// import { useState } from "react";
function Signup({ data, setData }) {
 const navigate = useNavigate();
  const handleSubmit = async (e) => {

    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data
      })
    })
    if (res.status===200) {
      console.log(res, 'res');
      alert('signup successfull')
      navigate('/login');
    }
     else if(res.status===401){
      alert('Already exist')
     }
     else{
      alert('server error');
     }


  }


  return (
    <form className="signin_form" onSubmit={(e) => handleSubmit(e)}>
      <input className="input" placeholder="Enter Name" type="text" id="Name" required={true} value={data.Name} onChange={(e) => setData({ ...data, Name: e.target.value })} />
      <input className="input" placeholder="Enter username" type="text" id="username" value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} required={true} />
      <input className="input" placeholder="Enter email" type="email" id="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} required={true} />
      <input className="input" placeholder="Enter password" type="password" id="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} required={true} />
      <button className="button_auth" type="submit"> REGISTER</button>

    </form>)  
}
export default Signup;