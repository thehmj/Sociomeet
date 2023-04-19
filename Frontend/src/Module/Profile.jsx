import '../Styles/Profile.css'
import Nav from "../Components/Navigation";
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import dustbin from '../images/delete.png';
import cross from '../images/close.png'
import BounceLoader from 'react-spinners/BounceLoader';

const Profile = () => {

  const forward = "https://sociomeetbackend.onrender.com";
  const navigate = useNavigate();
  const [userinfo, SetUserinfo] = useState({});
  const [posts, setPosts] = useState([]);
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([])
  const [showfollower, SetShowfollower] = useState(false)
  const [showfollowing, SetShowfollowing] = useState(false)
  const [showpostsonly, SetShowpostonly] = useState(true)
  const [loading, SetLoading] = useState(false);


  useEffect(() => {
    const getposts = async () => {
      SetLoading(true);
      const response = await fetch(`${forward}/api/profile`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('user:token')}`
        }
      })
      SetLoading(false);
      if (response.status === 200) {

        const { posts, user, follower, following } = await response.json();
        setPosts(posts);
        SetUserinfo(user);
        setFollower(follower);
        setFollowing(following);
      }
      else if(response.status===440){
          alert('session expired');
          localStorage.removeItem('user:token');
          return navigate('/login');
      
      }
      else {
        alert('server error');
      }

    }
    getposts()
     //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  console.log(posts);
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
            <div className='profile_image' onClick={() => navigate('/profileimageupload')}>

              <img src={userinfo.Pimage} alt="notfound" />


            </div>
            <h2 className='profile-data_up_Name' >{userinfo.Name}</h2>
            <div className='profile-data_up_username'>@{userinfo.username}</div>
            <div className='profile-data_up_bio'>
              {userinfo?.bio}
            </div>
            <div className='profile-data_up_stats'>
              <div className='profile_post_btn'style={showpostsonly ? { color : "red"}:{ color : "black"} } onClick={() => SetShowpostonly(true)}>
                {posts.length} Posts
              </div>
              <div className='profile_followers'>
                <div onClick={() => SetShowfollower(true)} className='profile_followers_div'>

                  {follower.length} Followers
                </div>
                {showfollower ?
                  <div className='Show_followers' >
                    <div className='show_followers_content'>
                      <span className='show_followers_content_top'>
                        <h4>Followers</h4>
                        <img className='closeimg' onClick={() => SetShowfollower(false)} src={cross} alt="" />
                      </span>

                      {
                        follower.length > 0 && follower.map(({ followby = {} }) => {
                          return (
                            <div onClick={() => navigate(`/${followby.username}`)}>
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
                  {following.length} Following
                </div>
                {showfollowing ?
                  <div className='Show_followers' >
                    <div className='show_followers_content'>
                      <span className='show_followers_content_top'>
                        <h4>Following</h4>
                        <img className='closeimg' onClick={() => SetShowfollowing(false)} src={cross} alt="" />
                      </span>

                      {
                        following.length > 0 && following.map(({ following = {} }) => {
                          return (
                            <div onClick={() => navigate(`/${following.username}`)}>
                              <div className='toshowimage' >
                                <img src={following.Pimage} alt="" />
                              </div>
                              <div className='flex-col'>
                                <h3>
                                  {following.Name}
                                </h3>
                                {following.username}
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

              <div className='profile_savepost_btn'style={showpostsonly ? { color : "black"}:{ color : "red"} } onClick={() => SetShowpostonly(false)}>Save Posts</div>

            </div>
          </div>
          {showpostsonly
            ?
            <div className='profile_posts'>
              {posts?.length > 0 && posts?.map(({ _id, caption = '', url = '', like = [], comments = [] }) => {

                return (

                  <div onClick={() => navigate(`/post/${_id}`)} className='profile_single_post' >
                    <img src={url} alt="" />

                    <div className='profile_single_post_stats' >
                      {/* <h4 onClick={() => navigate(`/post/${_id}`)} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>See Post</h4> */}
                      <div>
                        {like.length} Likes &nbsp;  {comments.length} Comment
                        {/* <img className='dustbin_post' onClick={() => deleteposts(_id)} src={dustbin} alt="" /> */}


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
            :
            <div className='profile_posts'>
              {userinfo?.Savepost?.length > 0 && userinfo?.Savepost?.map(({ _id, caption = '', url = '', like = [], comments = [] }) => {

                return (

                  <div onClick={() => navigate(`/post/${_id}`)} className='profile_single_post' >



                    <img src={url} alt="" />

                    <div className='profile_single_post_stats' >
                      {/* <h4 onClick={() => navigate(`/post/${_id}`)} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>See Post</h4> */}
                      <div>
                        {like.length} Likes &nbsp;  {comments.length} Comment
                        {/* <img className='dustbin_post' onClick={() => deleteposts(_id)} src={dustbin} alt="" /> */}


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
          }
        </div>

      </div>


    </div>
  )
}

export default Profile;