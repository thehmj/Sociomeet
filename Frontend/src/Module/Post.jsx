import { useEffect, useState } from 'react'
import Nav from '../Components/Navigation'
import '../Styles/Post.css'
import { useNavigate, useParams } from 'react-router-dom'
import likebefore from '../images/love.png'
import likeafter from '../images/heart.png'
import cross from '../images/close.png'
import save from '../images/bookmark.png'
import unsave from '../images/save.png'
import dustbin from '../images/delete.png';
import BounceLoader from 'react-spinners/BounceLoader';


const Post = () => {
    const forward = "https://sociomeetbackend.onrender.com";
    const [thispost, SetThispost] = useState();
    const { post_id } = useParams();
    const [mycomment, SetMycomment] = useState();
    const [mydata, setMydata] = useState();
    const [showlikes, SetShowlikes] = useState(false);
    const [loading, SetLoading] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        SetLoading(true);
        const getthispost = async () => {
            const response = await fetch(`${forward}/api/post/?post_id=${post_id}`, {
                method: 'GET',
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
            const { postdetails, user } = await response.json();
            SetThispost(postdetails);
            setMydata(user);

        }
        getthispost();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const postmycomment = async (e) => {

        e.preventDefault();
        SetLoading(true);
        const response = await fetch(`${forward}/api/postcomment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({
                comment: mycomment,
                postid: post_id

            })
        })
          SetLoading(false);
        const postedcomment = await response.json();
        console.log(postedcomment);
        SetThispost(postedcomment?.postedcomment);
        SetMycomment('');
    }


    const handlelike = async (_id) => {
        SetLoading(true);
        const response = await fetch(`${forward}/api/like`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({ postid: _id })

        })
    SetLoading(false);
        const { postliked } = await response.json();
        SetThispost(postliked);

    }
    const handleunlike = async (_id) => {
        SetLoading(true);
        const response = await fetch(`${forward}/api/unlike`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({ postid: _id })

        })
        SetLoading(false);
        const { postliked } = await response.json();
        SetThispost(postliked);

    }
    const deleteposts = async (postid) => {
        SetLoading(true);
        const response = await fetch(`${forward}/api/deletepost`, {
            method: "Delete",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({
                postid: postid
            })
        })
        SetLoading(false);
        if (response.status === 200) {
            navigate('/');
        }
        else {
            alert('error')
        }
    }

    const Savethispost = async (_id) => {
        SetLoading(true);
        const response = await fetch(`${forward}/api/savethispost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({ postid: _id })

        })
        SetLoading(false);
        const { userpostsaved } = await response.json();
        setMydata(userpostsaved);
    }

    const Unsavethispost = async (_id) => {

        SetLoading(true);
        const response = await fetch(`${forward}/api/unsavethispost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({ postid: _id })

        })
        SetLoading(false);
        const { userpostunsaved } = await response.json();
        setMydata(userpostunsaved);
    }


    return (
        <>
            <Nav />

            <div className="post" >
                <div className='single_post'>
                    <div className="single_post_username" >
                        <div className="single_post_username_image">
                            <img src={thispost?.userId?.Pimage} alt="" />
                        </div>
                        <div > {thispost?.userId?.username} </div>

                    </div>
                    {loading ?
                        <div className="Bounceloader">
                            <BounceLoader />
                            Loading...
                        </div>
                        :
                        <div></div>
                    }

                    <div className="single_post_image">                
                            <img src={thispost?.url} alt="" />
                        
                  </div>

                    <div className="post_likes">
                        <div className="post_likes_section">
                            <span>
                                {thispost?.like?.some(obj => obj._id === mydata._id)
                                    ? <img src={likeafter} alt="" onClick={() => handleunlike(thispost._id)} />
                                    : <img src={likebefore} alt="" onClick={() => handlelike(thispost._id)} />
                                }
                            </span>
                            <span></span>
                            <span>
                                {
                                    thispost?.userId?._id === mydata?._id
                                        ?
                                        <img className='dustbin_post' onClick={() => deleteposts(thispost._id)} src={dustbin} alt="" />

                                        :
                                        <></>
                                }
                            </span>

                            <span className="home_post_save">

                                {
                                    mydata?.Savepost?.includes(thispost._id) ?
                                        <img onClick={() => Unsavethispost(thispost._id)} src={save} alt="" />
                                        :
                                        <img onClick={() => Savethispost(thispost._id)} src={unsave} alt="" />
                                }
                            </span>
                        </div>

                        {
                            showlikes ?
                                <div className='showlikes'>
                                    <div className='showlikesbox'>
                                        <div className='showlikesboxtop'>
                                            <h2>
                                                Likes
                                            </h2>
                                            <img onClick={() => SetShowlikes(false)} src={cross} alt="" />
                                        </div>
                                        <div className='showlikesboxbottom'>
                                            {
                                                thispost?.like?.map((like) => {
                                                    return (
                                                        <div className='likediv'>
                                                            <img onClick={() => like._id === mydata?._id ? navigate('/profile') : navigate(`/${like?.username}`)} src={like?.Pimage} alt="" />
                                                            <span onClick={() => like._id === mydata?._id ? navigate('/profile') : navigate(`/${like?.username}`)} >

                                                                {
                                                                    like?.username
                                                                }
                                                            </span>
                                                        </div>
                                                    )
                                                })

                                            }
                                        </div>
                                    </div>
                                </div>
                                :
                                <span>
                                    <span onClick={() => SetShowlikes(true)} className='likesnumber'>
                                        {thispost?.like?.length} Likes
                                    </span>

                                    <span style={{ padding: '10px' }}>
                                        {thispost?.comments?.length} Comments
                                    </span>
                                </span>

                        }
                    </div>
                    <div className='post_caption'>
                        <span style={{ fontWeight: "bold", cursor: "pointer" }}> {thispost?.userId?.username} </span>
                        {thispost?.caption}
                    </div>

                </div>


                <div className='post_stats'>

                    
                    <form className='post_stats_add' onSubmit={(e) => postmycomment(e)} >
                        <textarea placeholder='Post a comment...' value={mycomment} onChange={(e) => SetMycomment(e.target.value)} required />
                        <button type="submit">Post Comment</button>
                    </form>
                    <div className='post_stats_comments'>
                        <h2 style={{ textAlign: 'center', margin: '2px', borderBottom: '1px solid' }}>Comments</h2>
                        {
                            thispost?.comments?.map(({ commentor = {}, comment = '' }) => {

                                return (
                                    <>
                                        <span className='post_stats_comments_all'>
                                            <div className='post_stats_comments_all_img'>
                                                <img src={commentor.Pimage} alt="" />
                                            </div>
                                            <div>
                                            <div className='comment_username'>{commentor.username}</div>

                                            <div>
                                                {comment}
                                            </div>
                                            </div>

                                        </span>
                                    </>
                                )
                            })

                        }

                    </div>
                </div>
            </div>


        </>
    )
}

export default Post;