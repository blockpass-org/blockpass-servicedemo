import React from 'react';
import { Avatar } from 'antd';
import './user.scss';
import defaultAvatar from './default.png';
import { PropTypes } from 'prop-types';

export const AvatarUser = ({imgUrl}) => <Avatar src={imgUrl} />

const User = ({userName, imgUrl=defaultAvatar}) => 
                <div className="user-header__wrapper">
                    <div className="user-header__avatar">
                        <AvatarUser imgUrl={imgUrl} />
                    </div>
                    <div className="user-header__username">
                        <h4>{userName}</h4>
                    </div>
                </div>
User.propTypes = {
    /**  username */
    userName: PropTypes.string.isRequired,
    /**  url of avatar of user */
    imgUrl: PropTypes.string,
}
export default User;