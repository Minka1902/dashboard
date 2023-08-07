import React from "react";
import Resource from "../resource/Resource";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function Main({ resources, isRefresh, resourceClick, switchPopups }) {
    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main name='home' id='home'>
            {currentUser ? <h1 className='main__title'>{currentUser.username}, welcome back!</h1> : <h1 className='main__title'>Welcome.<br />To edit resources please <span className='signin' onClick={switchPopups}>sign in</span>.</h1>}
            <div className='resources' >
                {resources.length !== 0 ? resources.map((resource, index) => {
                    return <Resource isRefresh={isRefresh} resource={resource} key={index} onClick={resourceClick} />
                }) : <></>}
            </div>
        </main>
    );
};