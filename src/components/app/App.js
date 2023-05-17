import React from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import Resource from '../resource/Resource';
import sourceApiOBJ from '../../utils/sourceApi';
import usersApiOBJ from '../../utils/usersApi';
import Header from '../header/Header';
import LoginPopup from '../popup/LoginPopup';
import ConfirmPopup from '../popup/ConfirmPopup';
import AddSourcePopup from '../popup/AddSourcePopup';
import * as auth from '../../utils/auth';

export default function App() {
  const [resources, setResources] = React.useState([]);
  const [isUserFound, setIsUserFound] = React.useState(true);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmLoginPopupOpen] = React.useState(false);
  const [isAddSourcePopupOpen, setIsAddSourcePopupOpen] = React.useState(false);
  const [deleteName, setDeleteName] = React.useState('');

  React.useEffect(() => {
    initialize();
    isAutoLogin();
  }, [])

  const isAutoLogin = () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.checkToken(jwt)
        .then((user) => {
          if (user) {
            setCurrentUser(user);
            setLoggedIn(true);
          }
        })
        .catch((err) => {
          console.log(`Check token error: ${err}`);
        });
    }
  }

  const closeAllPopups = () => {
    setIsLoginPopupOpen(false);
    setIsAddSourcePopupOpen(false);
    setIsConfirmLoginPopupOpen(false);
  };

  const openPopup = () => {
    if (loggedIn) {
      setIsAddSourcePopupOpen(true);
    } else {
      setIsLoginPopupOpen(true);
    }
  };

  const deleteSource = () => {
    sourceApiOBJ.deleteSource(deleteName)
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      })
      .finally(() => {
        closeAllPopups();
        initialize();
      })
  };

  const resourceClick = (resource, hidePreloader) => {
    sourceApiOBJ.checkSource(resource.url)
      .then((data) => {
        let newData = { lastActive: data.isActive ? new Date() : resource.lastActive };
        newData.isActive = data ? data.isActive : false;
        newData.status = data.status;
        newData.lastChecked = data.lastChecked;
        sourceApiOBJ.updateSource(resource.name, newData)
          .catch((err) => {
            if (err) {
              console.log(err);
            }
          })
          .finally(() => {
            initialize();
          });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
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

  const createNewSource = (source) => {
    sourceApiOBJ.createSource(source)
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      })
      .finally(() => {
        initialize();
      });
  }

  const handleAddSourceSubmit = ({ name, url }) => {
    sourceApiOBJ.checkSource(url)
      .then((data) => {
        const source = { name, url, status: data.status, lastActive: new Date('1970-01-01'), lastChecked: new Date(), isActive: data.isActive }
        if (source) {
          createNewSource(source);
        }
      })
      .catch((err) => {
        if (err) {
          const source = { name, url, status: 404, lastActive: new Date('1970-01-01'), lastChecked: new Date(), isActive: true }
          if (source) {
            createNewSource(source);
          }
        }
      })
      .finally(() => {
        closeAllPopups();
      });
  };

  const initialize = () => {
    sourceApiOBJ.init()
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
  };

  const deleteClicked = (name) => {
    setIsConfirmLoginPopupOpen(true);
    setDeleteName(name);
  }

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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Header handleButtonClick={openPopup} />
        {loggedIn ? <h3 className='app__title'>Hello {currentUser.username}, welcome back!</h3> : <></>}
        <div className='resources'>
          {resources[0] ? resources.map((resource, index) => {
            return <Resource deleteSource={deleteClicked} resource={resource} key={index} onClick={resourceClick} isLoggedIn={loggedIn} />
          }) : <></>}
        </div>
        <LoginPopup
          handleLogin={handleLoginSubmit}
          isOpen={isLoginPopupOpen}
          isFound={isUserFound}
          linkText='Add source'
          onClose={closeAllPopups}
          handleSwitchPopup={switchPopups} />

        <ConfirmPopup isOpen={isConfirmPopupOpen} onClose={closeAllPopups} handleSubmit={deleteSource} />

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
