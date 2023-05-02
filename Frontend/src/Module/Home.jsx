import { useNavigate } from "react-router-dom";
import '../Styles/Home.css'
import Nav from "../Components/Navigation";
import { useEffect, useState } from 'react';
import BounceLoader from 'react-spinners/BounceLoader';
import likebefore from '../images/love.png'
import likeafter from '../images/heart.png'
import save from '../images/bookmark.png'
import unsave from '../images/save.png'
import cross from '../images/close.png'

function Home() {

    const forward = "https://sociomeetbackend.onrender.com";
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [mydata, setMydata] = useState([]);
    const [search, SetSearch] = useState();
    const [searchresult, SetSearchresult] = useState([]);
    const [loading, SetLoading] = useState(false);


    useEffect(() => {
        const homeposts = async () => {
            SetLoading(true);
            const response = await fetch(`${forward}/api/homeposts`, {
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
            const { posts, user } = await response.json();
            const [myuser] = user;
            setMydata(myuser);
            setPosts(posts);
        }
        homeposts()
         //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlelike = async (_id, index) => {
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
        const changedlike = posts?.map((post, i) => {
            if (i === index) return postliked
            else return post;
        })
        setPosts(changedlike);

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

    const handleunlike = async (_id, index) => {
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
        const changedlike = posts?.map((post, i) => {
            if (i === index) return postliked
            else return post;
        })
        setPosts(changedlike);

    }

    const searching = async (e) => {
        SetSearch(e.target.value);
        console.log(e.target.value);
        const Usearch = e.target.value;
        SetLoading(true);
        const response = await fetch(`${forward}/api/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({
                search: Usearch
            })
        })
        SetLoading(false);
        const { searchresult } = await response.json();
        SetSearchresult(searchresult);

    }

    return (
        <div className="Home">
            <Nav />
            <div className="Home_main">
                <div className="left_home">
                    <div className="left_home_profile">
                        <div className="left_home_profile_image">
                            <img src={mydata?.Pimage} alt="" />
                        </div>
                        <div className="left_home_profile_Name">
                            {mydata.Name}
                        </div>
                        <div className="left_home_profile_username">
                            @{mydata.username}
                        </div>
                    </div>
                    <div className="home_nav">
                        <div className='nav_search'>
                            <input type="text" placeholder='Search' value={search} onChange={(e) => searching(e)} />
                        </div>
                    <div>
                        {
                            search ?


                                <div className='searchresultbox'>
                                    <div className='searchresultboxtop'>
                                        <img onClick={() => SetSearch('')} src={cross} alt="" />
                                    </div>
                                    {searchresult.length > 0 ?

                                        searchresult?.map((searchresulti) => {
                                            return (
                                                <div className='searchresultboxbottom'>
                                                    <img onClick={() => searchresulti?.username === mydata.username ? navigate('/profile') : navigate(`/${searchresulti?.username}`)} src={searchresulti?.Pimage} alt="" />
                                                    <div onClick={() => searchresulti?.username === mydata.username ? navigate('/profile') : navigate(`/${searchresulti?.username}`)}>

                                                        {searchresulti?.username}
                                                    </div>

                                                </div>
                                            )
                                        })
                                        :
                                        <div className='searchresultboxbottom'>
                                            No user found
                                        </div>

                                    }

                                </div>

                                : <div></div>
                        }
                    </div>
                    </div>

                    {loading ?
                        <div className="Bounceloader">
                            <BounceLoader />
                            Loading...
                        </div>
                        :
                        <div></div>
                    }
                </div>

                <div className="middle_home">


                    {
                        posts?.length > 0 &&
                        posts?.map(({ url = '', userId, _id = '', caption = '', like = [], comments = [] }, index) => {
                            console.log("like array:", like);
                            const isLiked = like ? like.some((obj) => (obj._id === mydata._id)) : false;

                            return (

                                <div className='home_single_post'>

                                    <div>
                                        <div className="home_single_post_username" onClick={() => userId.username === mydata.username ? navigate('/profile') : navigate(`/${userId.username}`)}>
                                            <div className="home_single_post_username_image">
                                                <img src={userId?.Pimage} alt="" />
                                            </div>
                                            <div > {userId?.username}</div>

                                        </div>

                                        <div className="home_single_post_image">
                                            <img onClick={() => navigate(`/post/${_id}`)} src={url} alt="" />
                                        </div>

                                        <div className="home_post_likes">
                                            <div className="home_post_likes_section">
                                                <span>
                                                    {isLiked
                                                        ? <img src={likeafter} alt="" onClick={() => handleunlike(_id, index)} />
                                                        : <img src={likebefore} alt="" onClick={() => handlelike(_id, index)} />
                                                    }
                                                </span>
                                                <span></span>
                                                <span className="home_post_save">

                                                    {
                                                        mydata?.Savepost?.includes(_id) ?
                                                            <img onClick={() => Unsavethispost(_id)} src={save} alt="" />
                                                            :
                                                            <img onClick={() => Savethispost(_id)} src={unsave} alt="" />
                                                    }
                                                </span>
                                            </div>
                                            <div className="home_post_stats">
                                                <span onClick={() => navigate(`/post/${_id}`)}>{like?.length} Likes</span>
                                                <span onClick={() => navigate(`/post/${_id}`)}> {comments?.length} Comment</span>


                                            </div>
                                        </div>
                                        <div className='home_post_caption'>
                                            <span style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => userId.username === mydata.username ? navigate('/profile') : navigate(`/${userId.username}`)}> {userId.username} </span>
                                            {caption}
                                        </div>
                                    </div>
                                </div>

                            )
                        })
                    }

                </div>

                {/* <div className="right_home">
                    <div>Creator</div>
                    <a href="https://www.linkedin.com/in/himanshu-jain-452270237/" target="_blank" rel="noopener noreferrer">
                        <div className="right_home_creator">
                            LinkedIn
                        </div>
                    </a>
                    <a href="https://github.com/thehmj" target="_blank" rel="noopener noreferrer" >
                        <div className="right_home_creator">
                            Github
                        </div>
                    </a>
                    <a href="https://leetcode.com/himanshu4jain/" target="_blank" rel="noopener noreferrer">
                        <div className="right_home_creator">
                            Leetcode
                        </div>
                    </a>


                    <div></div>
                </div> */}
            </div>
        </div>
    )
}

export default Home;