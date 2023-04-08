import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BounceLoader from 'react-spinners/BounceLoader';

function Signin({ data, setData }) {
  const forward = "https://sociomeetbackend.onrender.com";

  const navigate = useNavigate();
  const [loading, SetLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    SetLoading(true);
    const res = await fetch(`${forward}/api/login`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        ...data
      })
    })
    SetLoading(false);
    console.log(res, 'res');
    if (res.status === 200) {
      const { token, user } = await res.json();
      console.log(token, user, 'res')
      localStorage.setItem('user:token', token)
      navigate('/');
    }
    else if (res.status === 401) {
      alert('Invalid user or password')
    }
    else {
      alert('server error')
    }

  }

  return (
    <div>{
      loading ?
        <BounceLoader />
        :

        <form className="signin_form" onSubmit={(e) => handleSubmit(e)}>
          <input className="input" type="email" placeholder="Enter your email" value={data.email} id="email" onChange={(e) => setData({ ...data, email: e.target.value })} required={true} />
          <input className="input" type="password" id="password" placeholder="Enter Password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} required={true} />
          <button className="button_auth" type="submit"> LOGIN</button>

        </form>
    }
    </div>
  )

}
export default Signin;