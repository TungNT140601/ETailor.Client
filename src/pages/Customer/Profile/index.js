import React from 'react'
import './index.css'
import UserAvatar from "../../../assets/images/user-avatar.jpg"

export default function CustomerProfile() {
    return (
        <div className='wrapper-profile'>
            <div>
                <div className='avatar-wrapper'>
                    <figure class="image is-32x32">
                        <img className='user-avatar' src={UserAvatar}></img>

                    </figure>
                    <h2 className='subtitle is-4'>Nguyễn Công Vũ </h2>
                </div>

            </div>
            <div>
                <div className='user-info'>
                    <h2 className='title is-2'>Nguyễn Công Vũ </h2>
                </div>
            </div>
        </div>
    )
}
