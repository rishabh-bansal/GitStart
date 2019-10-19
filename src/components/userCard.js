import React from 'react';

const Card = ({fullname, username}) => (
    <a href={"https://github.com/"+username} className="profile">
        <img src={"https://avatars1.githubusercontent.com/"+username+"?size=200"}/>
        <p>{fullname}</p>
    </a>
);

export default Card;
