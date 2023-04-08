import { useState, useEffect } from 'react'
import '../Styles/Createpost.css'
import Nav from "../Components/Navigation";
import { useNavigate } from 'react-router-dom'
import BounceLoader from 'react-spinners/BounceLoader';

const CreatePost = () => {
    const forward = "https://sociomeetbackend.onrender.com";
    const [data, setData] = useState({
        caption: '',
        img: '',
    });
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState();
    const [loading, SetLoading] = useState(false);


    useEffect(() => {
        if (data.img) {
            setImageUrl(URL.createObjectURL(data.img));
        }
    }, [data.img]);

    const uploadImage = async () => {
        const formData = new FormData();
        formData.append('file', data.img);
        formData.append('upload_preset', 'socialmedia')
        formData.append('cloud_name', 'dybpftiua')
        console.log(formData);
        const res = await fetch('https://api.cloudinary.com/v1_1/dybpftiua/upload', {
            method: "POST",
            body: formData
        }
        )
        if (res.status === 200) {
            return await res.json();
        }
        else {
            alert('image-server error')
            // return 'error';
        }
    }

    const handlesubmit = async (e) => {
        e.preventDefault();
        if (data.img === '') {
            return alert('Please upload a picture');
        }
        SetLoading(true);

        const { secure_url } = await uploadImage();

        const response = await fetch(`${forward}/api/createpost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({
                caption: data.caption,
                url: secure_url,
            })
        })
        SetLoading(false);

        console.log(response, 'postt');
        if (response.status === 200) {
            navigate('/')
        } else {
            return alert(' Server error');
        }
    }

    return (
        <>
            <Nav />
            <div className='Createpost'>
                {
                    loading ?
                        <BounceLoader />
                        :
                        <div className='Createpost_box'>
                            <div className='createpost_show_image' >
                                <img src={imageUrl} alt="Uploaded will display here" />
                            </div>
                            <form className='Createpost_form' onSubmit={(e) => handlesubmit(e)}>
                                <textarea type="text" name='caption' placeholder='Caption' id='caption' value={data.caption} onChange={(e) => setData({ ...data, caption: e.target.value })} required />
                                <input type="file" name='image' id="Createpost_image_hidden" accept="image/*" onChange={(e) => setData({ ...data, img: e.target.files[0] })} />
                                <label for='Createpost_image_hidden' className='Createpost_image_labbel'>{data?.img?.name || 'CLICK here to upload image'}</label>
                                <button type="submit">Upload</button>
                            </form>
                        </div>
                }
            </div>
        </>
    )

}

export default CreatePost;