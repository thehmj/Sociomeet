// import { useState } from 'react'
import { useState, useEffect } from 'react'
import BounceLoader from 'react-spinners/BounceLoader';
import '../Styles/Createpost.css'
import Nav from "../Components/Navigation";
import { useNavigate } from 'react-router-dom'


const Profileimage = () => {
    const forward = "https://sociomeetbackend.onrender.com";
    const [data, setData] = useState();
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState();
    const [loading, SetLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setImageUrl(URL.createObjectURL(data));
        }
    }, [data]);

    const uploadImage = async () => {

        const formData = new FormData();
        formData.append('file', data);
        formData.append('upload_preset', 'socialmedia')
        formData.append('cloud_name', 'dybpftiua')
        console.log(formData);
        const res = await fetch('https://api.cloudinary.com/v1_1/dybpftiua/upload', {
            method: "POST",
            body: formData
        }
        )
        // const imageUrl = await res.json();
        // console.log(imageUrl,'imageurl');
        if (res.status === 200) {
            return await res.json();
        }
        else {
            return 'error';
        }
    }

    const handlesubmit = async (e) => {
        e.preventDefault();
        if (data === '') {
            return alert('Please upload a picture');
        }
        // console.log(data);
        SetLoading(true);
        const { secure_url } = await uploadImage();

        const response = await fetch(`${forward}/api/profileimageupload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({
                url: secure_url,
            })
        })
        SetLoading(false);

        // console.log(response, 'postt');
        if (response.status === 200) {
            navigate('/profile')
        } else {
            return alert('error');
        }
    }

    return (
        <>
            <Nav />
            <div className='Createpost'>
                {loading
                    ?
                    <BounceLoader />
                    :
                    <div className='Createpost_box'>
                        <div className='createpost_show_image' placeholder='Uploaded Image will display here' >
                            <img src={imageUrl} alt="Uploaded will display here" />
                        </div>
                        <form className='Createpost_form' onSubmit={(e) => handlesubmit(e)}>
                            <input type="file" name='image' id="Createpost_image_hidden" accept="image/*" onChange={(e) => setData(e.target.files[0])} />
                            <label for='Createpost_image_hidden' className='Createpost_image_labbel'> {data?.name || 'CLICK here to upload image'}</label>
                            <button type="submit">Upload</button>
                        </form>
                    </div>
                }
            </div>
        </>
    )

}

export default Profileimage;