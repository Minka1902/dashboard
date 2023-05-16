import React from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import Resource2 from '../resource/Resource';
import resourceApiObj from '../../utils/resourceApi';
import sourceApiOBJ from '../../utils/sourceApi';
import usersApiOBJ from '../../utils/usersApi';
import Header from '../header/Header';
import LoginPopup from '../popup/LoginPopup';
import AddSourcePopup from '../popup/AddSourcePopup';

export default function App() {
  const [resources, setResources] = React.useState([]);
  const [isUserFound, setIsUserFound] = React.useState(true);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = React.useState(false);
  const [isAddSourcePopupOpen, setIsAddSourcePopupOpen] = React.useState(false);

  const closeAllPopups = () => {
    setIsLoginPopupOpen(false);
    setIsAddSourcePopupOpen(false);
  };

  const openAddSourcePopup = () => setIsAddSourcePopupOpen(true);

  const resourceClick = (resource, hidePreloader) => {
    resourceApiObj.refresh(resource.url)
      .then((data) => {
        if (data) {
          let newData = {};
          newData.lastActive = data ? new Date() : resource.lastActive;
          newData.isActive = data ? true : false;
          newData.status = data ? data.status : resource.status;
          newData.lastChecked = new Date();
          newData.updatedAt = new Date();
          sourceApiOBJ.updateSource(resource.name, newData)
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
          newData.lastActive = err ? new Date() : resource.lastActive;
          newData.isActive = false;
          newData.status = 404;
          newData.lastChecked = new Date();
          newData.updatedAt = new Date();
          sourceApiOBJ.updateSource(resource.name, newData)
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
  };

  const switchPopups = (evt) => {
    closeAllPopups();
    if (evt.target.parentElement.parentElement.parentElement.parentElement.classList.contains(`popup_type_add-source`)) {
      setIsLoginPopupOpen(true);
    } else {
      setIsAddSourcePopupOpen(true);
    }
  };

  const findUserInfo = () => {
    usersApiOBJ
      .getCurrentUser()
      .then((user) => {
        if (user) {
          setCurrentUser(user);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(`Error type: ${err.message}`);
          setLoggedIn(false);
        }
      })
      .finally(() => {
        closeAllPopups({ isProject: false });
      });
  }

  // * Handling login form submit
  const handleLoginSubmit = (email, password) => {
    usersApiOBJ
      .login({ email, password })
      .then((data) => {
        if (data.jwt) {
          localStorage.setItem('jwt', data.jwt);
        }
        if (data.user._id) {
          setIsUserFound(true);
          findUserInfo();
        }
      })
      .catch((err) => {
        console.log(`Error type: ${err.message}`);
        if ((err === 'Error: 404') || (err.message === 'Failed to fetch')) {
          setIsUserFound(false);
        }
        setLoggedIn(false);
      });
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

  const createNewSource = (source) => {
    sourceApiOBJ.createSource(source)
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      })
      .finally(() => {
        sourceApiOBJ.initialize()
          .then((data) => {
            if (data) {
              setResources(data);
            }
          })
          .catch((err) => {
            if (err) {
              console.log(err);
            }
          });
      });
  }

  const handleAddSourceSubmit = ({ name, url }) => {
    resourceApiObj.refresh(url)
      .then(() => {
        const source = { name, url, status: 200, lastActive: new Date('1970-01-01'), lastChecked: new Date(), isActive: true }
        if (source) {
          createNewSource(source);
        }
      })
      .catch((err) => {
        if (err) {
          const source = { name, url, status: 500, lastActive: new Date('1970-01-01'), lastChecked: new Date(), isActive: true }
          if (source) {
            createNewSource(source);
          }
        }
      })
      .finally(() => {
        closeAllPopups();
      });
  };

  React.useEffect(() => {
    sourceApiOBJ.initialize()
      .then((data) => {
        if (data) {
          setResources(data);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Header handleButtonClick={openAddSourcePopup} />
        {loggedIn ? <h3 className='app__title'>Hello {currentUser.username}, welcome back!</h3> : <></>}
        <div className='resources'>
          {resources[0] ? resources.map((resource, index) => {
            return <Resource2 resource={resource} key={index} onClick={resourceClick} />
          }) : <></>}
        </div>
        <LoginPopup
          handleLogin={handleLoginSubmit}
          isOpen={isLoginPopupOpen}
          isFound={isUserFound}
          linkText='Add source'
          onClose={closeAllPopups}
          handleSwitchPopup={switchPopups} />

        <AddSourcePopup
          isLoggedIn={loggedIn}
          onSubmit={handleAddSourceSubmit}
          isOpen={isAddSourcePopupOpen}
          linkText='Sign in'
          handleSwitchPopup={switchPopups}
          onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}
