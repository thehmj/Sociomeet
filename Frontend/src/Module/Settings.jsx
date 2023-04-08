import { useState } from 'react'
import Nav from '../Components/Navigation'
import '../Styles/Settings.css'

const Setting = () => {


    const [bio, setBio] = useState('');
    const [Name, setName] = useState();
    const [password, setPassword] = useState();
    const updateName = async (e) => {
        e.preventDefault();
        if (!Name) {
            return alert('empty')
        }
        const response = await fetch('http://localhost:5000/api/updatename', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({
                Name: Name
            })
        })
        if (response.status === 200) {
            setName('');
            alert('changed')
        }
        else {
            alert('error')
        }
    }
    const updatepassword = async (e) => {
        e.preventDefault();
        if (!password) {
            return alert('empty')
        }
        const response = await fetch('http://localhost:5000/api/updatepassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({
                password: password
            })
        })
        if (response.status === 200) {
            setPassword('');
            alert('changed');
        }
        else {
            alert('error')
        }

    }
    const updatebio = async (e) => {
        e.preventDefault();
        if (!bio) {
            return alert('empty')
        }
        const response = await fetch('http://localhost:5000/api/updatebio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({
                bio: bio
            })
        })

        if (response.status === 200) {
            setBio('');
            alert('changed')
        }
        else {
            alert('error')
        }

    }
    return (
        <>
            <Nav />
            <div className='settings'>
                <div className='settingsbox'>
                    <div className='settingsboxtop'> Settings</div>

                    <div className='settingsboxbottom'>
                        <div className='settingsboxbottompart'>
                            <div className='nameofpart'>Name :</div>
                            <form className='updatebio' onSubmit={(e) => updateName(e)}>
                                <input type="text" name="bio" id="bio" value={Name} onChange={(e) => setName(e.target.value)} maxLength={50} />
                                <button type='submit'>Update Name</button>
                            </form>
                        </div>
                        <div className='settingsboxbottompart'>
                            <div className='nameofpart'>Password :</div>
                            <form className='updatebio' onSubmit={(e) => updatepassword(e)}>
                                <input type="text" name="bio" id="bio" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={50} />
                                <button type='submit'>Update Password</button>
                            </form>
                        </div>
                        <div className='settingsboxbottompart'>
                            <div className='nameofpart'>Bio:</div>
                            <form className='updatebio' onSubmit={(e) => updatebio(e)}>
                                <input type="text" name="bio" id="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={50} />
                                <button type='submit'>Update Bio</button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default Setting;