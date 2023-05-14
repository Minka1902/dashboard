import React from 'react';
import Resource2 from '../resource/Resource';
import resourceApiObj from '../../utils/resourceApi';
import sourceApiOBJ from '../../utils/sourceApi';
import { resources } from '../../constants/constants';
import Header from '../header/Header';
import LoginPopup from '../popup/LoginPopup';
import AddSourcePopup from '../popup/AddSourcePopup';

export default function App() {
  // const [resources, setResources] = React.useState();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = React.useState(false);
  const [isAddSourcePopupOpen, setIsAddSourcePopupOpen] = React.useState(false);
  const resourceArray = { 'Geomage.com': 'https://www.geomage.com', '89.192.15.12': '2', 'nebius': '3', 'cloud.il': '4', '89.192.15.11': '5' };

  const closeAllPopups = () => {
    setIsLoginPopupOpen(false);
    setIsAddSourcePopupOpen(false);
  };

  const openLoginPopup = () => setIsLoginPopupOpen(true);

  const openAddSourcePopup = () => setIsAddSourcePopupOpen(true);

  const resourceClick = (name, hidePreloader) => {
    const resourceUrl = resourceArray[name];
    if (resourceUrl) {
      resourceApiObj.refresh(resourceUrl)
        .then((data) => {
          if (data) {
            let newData = {};
            newData.lastActive = data ? new Date() : null;
            newData.isActive = data ? true : false;
            newData.status = data ? 200 : 404;
            newData.lastChecked = new Date();
            newData.updatedAt = new Date();
            sourceApiOBJ.updateSource(name, newData)
              .then((data) => {
                if (data) {
                  console.log(data);
                }
              })
              .catch((err) => {
                if (err) {
                  console.log(err);
                }
              })
          }
        })
        .catch((err) => {
          if (err) {
            let newData = {};
            newData.lastActive = err ? new Date() : null;
            newData.isActive = false;
            newData.status = 404;
            newData.lastChecked = new Date();
            newData.updatedAt = new Date();
            sourceApiOBJ.updateSource(name, newData)
              .then((data) => {
                if (data) {
                  console.log(data);
                }
              })
              .catch((err) => {
                if (err) {
                  console.log(err);
                }
              })
          }
        })
        .finally(() => {
          hidePreloader();
        });
    }
  };

  const switchPopups = (evt) => {
    closeAllPopups();
    if (evt.target.parentElement.parentElement.parentElement.parentElement.classList.contains(`popup_type_add-source`)) {
      setIsLoginPopupOpen(true);
    } else {
      setIsAddSourcePopupOpen(true);
    }
  };

  // * Handling login form submit
  const handleLoginSubmit = (email, password) => {
    // usersApiOBJ
    //   .login({ email, password })
    //   .then((data) => {
    //     if (data.jwt) {
    //       localStorage.setItem('jwt', data.jwt);
    //     }
    //     if (data.user._id) {
    //       setIsUserFound(true);
    //       findUserInfo();
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(`Error type: ${err.message}`);
    //     if ((err === 'Error: 404') || (err.message === 'Failed to fetch')) {
    //       setIsUserFound(false);
    //     }
    //     setLoggedIn(false);
    //   })
    //   .finally(() => {
    //     gettingSavedArticles();
    //   })
  };

  // * close popup by ESCAPE 
  React.useEffect(() => {
    const closeByEscape = (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    };

    document.addEventListener('keydown', closeByEscape);
    return () => document.removeEventListener('keydown', closeByEscape);
    // eslint-disable-next-line
  }, []);

  // ! Adding event listener for the page
  // ! Mouse event
  React.useEffect(() => {
    const closeByClick = (evt) => {
      if (evt.target.classList.contains('popup_type_project')) {
        closeAllPopups({ isProject: true });
      } else {
        if (evt.target.classList.contains("popup")) {
          closeAllPopups({ isProject: false });
        }
      }
    }

    document.addEventListener('mouseup', closeByClick);
    return () => document.removeEventListener('mouseup', closeByClick);
  });

  // React.useEffect(() => {
  //   sourceApiOBJ.initialize()
  //     .then((data) => {
  //       if (data) {
  //         setResources(data);
  //       }
  //     })
  //     .catch((err) => {
  //       if (err) {
  //         console.log(err);
  //       }
  //     })
  // }, []);

  return (
    <div className="app">
      <Header handleButtonClick={openAddSourcePopup} />
      <div className='resources'>
        {resources.map((resource, index) => {
          return <Resource2 resource={resource} key={index} onClick={resourceClick} />
        })}
      </div>
      <LoginPopup
        handleLogin={handleLoginSubmit}
        isOpen={isLoginPopupOpen}
        isFound={true}
        linkText='Add source'
        onClose={closeAllPopups}
        handleSwitchPopup={switchPopups} />
      <AddSourcePopup
        isOpen={isAddSourcePopupOpen}
        linkText='Sign in'
        handleSwitchPopup={switchPopups}
        onClose={closeAllPopups} />
    </div>
  );
}
