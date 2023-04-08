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


const Post = () => {
    const [thispost, SetThispost] = useState();
    const { post_id } = useParams();
    const [mycomment, SetMycomment] = useState();
    const [mydata, setMydata] = useState();
    const [showlikes, SetShowlikes] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {

        const getthispost = async () => {
            const response = await fetch(`http://localhost:5000/api/post/?post_id=${post_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('user:token')}`
                }

            })
            const { postdetails, user } = await response.json();
            SetThispost(postdetails);
            setMydata(user);
            
        }
        getthispost();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    const postmycomment = async (e) => {

        e.preventDefault();

        const response = await fetch('http://localhost:5000/api/postcomment', {
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

        const postedcomment = await response.json();
        console.log(postedcomment);
        SetThispost(postedcomment?.postedcomment);
        SetMycomment('');
    }


    const handlelike = async (_id) => {
        const response = await fetch('http://localhost:5000/api/like', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({ postid: _id })

        })

        const { postliked } = await response.json();
        SetThispost(postliked);

    }
    const handleunlike = async (_id) => {
        const response = await fetch('http://localhost:5000/api/unlike', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({ postid: _id })

        })
        const { postliked } = await response.json();
        SetThispost(postliked);

    }
    const deleteposts = async (postid) => {
        const response = await fetch('http://localhost:5000/api/deletepost', {
            method: "Delete",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({
                postid: postid
            })
        })
        if(response.status===200){
        navigate('/');}
        else{
            alert('error')
        }
    }

    const Savethispost = async (_id) => {
        const response = await fetch('http://localhost:5000/api/savethispost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({ postid: _id })

        })
        const { userpostsaved } = await response.json();
        setMydata(userpostsaved);
    }

    const Unsavethispost = async (_id) => {
        const response = await fetch('http://localhost:5000/api/unsavethispost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({ postid: _id })

        })
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
                                                            <img onClick={()=>like._id === mydata?._id ? navigate('/profile'): navigate(`/${like?.username}`) } src={like?.Pimage} alt="" />
                                                            <span  onClick={()=>like._id === mydata?._id ? navigate('/profile'): navigate(`/${like?.username}`) } >

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
                                            <div>{commentor.username} : </div>

                                            <div>
                                                {comment}
                                            </div>

                                        </span>
                                    </>
                                )
                            })

                        }

                    </div>
                    <form className='post_stats_add' onSubmit={(e) => postmycomment(e)} >
                        <textarea placeholder='Post a comment...' value={mycomment} onChange={(e) => SetMycomment(e.target.value)} required />
                        <button type="submit">Post Comment</button>
                    </form>
                </div>
            </div>


        </>
    )
}

export default Post;