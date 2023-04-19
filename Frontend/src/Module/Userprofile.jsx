import '../Styles/Profile.css'
import Nav from "../Components/Navigation";
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cross from '../images/close.png'
import BounceLoader from 'react-spinners/BounceLoader';

const Userprofile = () => {
  const forward = "https://sociomeetbackend.onrender.com";
  
  const { username } = useParams();
  const navigate = useNavigate();
  const [userinfo, SetUserinfo] = useState({});
  const [posts, setPosts] = useState([]);
  const [follow, setFollow] = useState('false');
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([])
  const [showfollower, SetShowfollower] = useState(false)
  const [showfollowing, SetShowfollowing] = useState(false)
  const [loading, SetLoading] = useState(false);


  useEffect(() => {
    const getposts = async () => {
      SetLoading(true);
      const response = await fetch(`${forward}/api/user?username=${username}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('user:token')}`
        }
      })
      SetLoading(false);
      if (response.status===440) {
        alert('session expired');
        localStorage.removeItem('user:token');
        return navigate('/login');
    }
      const { posts, UserDetails, isFollowed, following, follower } = await response.json();

      setPosts(posts);
      SetUserinfo(UserDetails);
      setFollow(isFollowed);
      setFollower(follower);
      setFollowing(following);


    }
    getposts()
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  const handlefollow = async () => {
    SetLoading(true);
    const response = await fetch(`${forward}/api/follow`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('user:token')}`
      },
      body: JSON.stringify({
        id: userinfo.id
      })
    })
    SetLoading(false);
    const res = await response.json();
    setFollow(res?.isFollowed);
  }


  const handleUnfollow = async () => {
    SetLoading(true);
    const response = await fetch(`${forward}/api/unfollow`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('user:token')}`
      },
      body: JSON.stringify({
        followid: userinfo.id
      })
    })
    SetLoading(false);
    const res = await response.json();
    setFollow(res?.isFollowed);


  }
  const navigatetoanother = async(anotheruser)=>{
    SetShowfollower(false);
    SetShowfollowing(false);
    const ff =`/${anotheruser}`;
  navigate( ff);
  }

  return (
    <div>
      <Nav />


      <div className='profile'>

        <div className='profile-data'>
        {loading ?
                        <div className="Bounceloader">
                            <BounceLoader />
                            Loading...
                        </div>
                        :
                        <div></div>
                    }
          
          <div className='profile-data_up'>
            <div className='profile_image'>
              <img src={userinfo?.Pimage} alt='' />
            </div>
            <h2 className='profile-data_up_Name' >{userinfo?.Name}</h2>
            <div className='profile-data_up_username'>@{userinfo?.username}</div>
            <div className='profile-data_up_bio'>
              {userinfo?.bio}
            </div>
            <div className='profile-data_up_stats'>
              <div>
                {posts?.length} Posts
              </div>
              <div className='profile_followers'>
                <div onClick={() => SetShowfollower(true)} className='profile_followers_div'>

                  {follower?.length} Followers
                </div>
                {showfollower ?
                  <div className='Show_followers' >
                    <div className='show_followers_content'>
                      <span className='show_followers_content_top'>
                        <h4>Followers</h4>
                        <img className='closeimg' onClick={() => SetShowfollower(false)} src={cross} alt="" />
                      </span>

                      {
                        follower?.length > 0 && follower.map(({ followby = {} }) => {
                          return (
                            <div onClick={() => navigatetoanother(followby?.username)}>
                              <div className='toshowimage' >
                                <img src={followby.Pimage} alt="" />
                              </div>
                              <div className='flex-col'>
                                <h3>
                                  {followby.Name}
                                </h3>
                                {followby.username}
                              </div>

                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                  : <></>
                }
              </div>

              <div className='profile_following'>
                <div onClick={() => SetShowfollowing(true)} className='profile_followers_div'>
                  {following?.length} Following
                </div>
                {showfollowing ?
                  <div className='Show_followers' >
                    <div className='show_followers_content'>
                      <span className='show_followers_content_top'>
                        <h4>Following</h4>
                        <img className='closeimg' onClick={()=>SetShowfollowing(false)}  src={cross} alt="" />
                      </span>

                      {
                        following?.length > 0 && following?.map(({ following = {} }) => {
                          return (
                            <div onClick={() =>navigatetoanother(following?.username)}>
                              <div className='toshowimage' >
                                <img src={following.Pimage} alt="" />
                              </div>
                              <div className='flex-col'>
                                <h3>
                                  {following?.Name}
                                </h3>
                                {following?.username}
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                  : <></>
                }
              </div>

            </div>
            {!follow ?
              <button className='profile_follow_button' onClick={() => handlefollow()}>Follow</button>
              :
              <button className='profile_follow_button' onClick={() => handleUnfollow()}>Unfollow</button>
            }
          </div>

          <div className='profile_posts'>
            {posts?.length > 0 && posts?.map(({ _id, caption = '', url = '', like = [] }) => {

              return (
                <div onClick={()=>navigate(`/post/${_id}`)} className='profile_single_post'>
                  <img src={url} alt="" />

                  <div className='profile_single_post_stats' >
                    <div>
                      {like?.length} Likes  Comment
                      {/*  <button onClick={() => deleteposts(_id)}>Delete</button> */}

                    </div>
                    <div className='profile_post_caption'>
                      {caption}
                    </div>
                  </div>

                </div>
              )
            })
            }
          </div>

        </div>

      </div>


    </div>
  )
}

export default Userprofile;