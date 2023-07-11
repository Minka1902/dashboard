import React from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import CurrentResourceContext from '../../contexts/CurrentResourceContext';
import RightClickMenu from '../rightClickMenu/RightClickMenu';
import Resource from '../resource/Resource';
import sourceApiOBJ from '../../utils/sourceApi';
import usersApiOBJ from '../../utils/usersApi';
import Header from '../header/Header';
import LoginPopup from '../popup/LoginPopup';
import ConfirmPopup from '../popup/ConfirmPopup';
import AddSourcePopup from '../popup/AddSourcePopup';
import Footer from '../footer/Footer';
import * as auth from '../../utils/auth';

export default function App() {
  const safeDocument = typeof document !== 'undefined' ? document : {};
  const html = safeDocument.documentElement;
  const [resources, setResources] = React.useState([]);
  const [isUserFound, setIsUserFound] = React.useState(true);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(undefined);
  const [currentResource, setCurrentResource] = React.useState(undefined);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmLoginPopupOpen] = React.useState(false);
  const [isAddSourcePopupOpen, setIsAddSourcePopupOpen] = React.useState(false);
  const [isRefresh, setIsRefresh] = React.useState(false);
  const [isEditSource, setIsEditSource] = React.useState(false);

  // ???????????????????????????????????????????????????
  // !!!!!!!!!!!!!     SCROLL handling     !!!!!!!!!!!!!
  // ???????????????????????????????????????????????????
  const noScroll = () => html.classList.add('no-scroll');
  const scroll = () => html.classList.remove('no-scroll');

  // ???????????????????????????????????????????????????
  // !!!!!!!!!!!!!!     USER handling     !!!!!!!!!!!!!!
  // ???????????????????????????????????????????????????
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
  };

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

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    setCurrentUser(undefined);
  };

  // ???????????????????????????????????????????????????
  // !!!!!!!!!!!!!     POPUP handling     !!!!!!!!!!!!!!
  // ???????????????????????????????????????????????????

  const closeAllPopups = () => {
    setIsLoginPopupOpen(false);
    setIsAddSourcePopupOpen(false);
    setIsConfirmLoginPopupOpen(false);
    setIsEditSource(false);
  };

  const openPopup = () => {
    if (loggedIn) {
      setIsAddSourcePopupOpen(true);
    } else {
      setIsLoginPopupOpen(true);
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

  // ???????????????????????????????????????????????????
  // !!!!!!!!!!!!!     SOURCE handling     !!!!!!!!!!!!!
  // ???????????????????????????????????????????????????
  const deleteSource = (prop) => {
    sourceApiOBJ.deleteSource(prop !== undefined ? prop.id : currentResource.idToDelete)
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      })
      .finally(() => {
        closeAllPopups();
        initialize();
        setCurrentResource(null);
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
  };

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
      })
      .finally(() => {
        setIsRefresh(false);
        scroll();
      });
  };

  const editSource = (newData) => {
    if (currentResource._id) {
      sourceApiOBJ.editSource(currentResource._id, newData)
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        })
        .finally(() => {
          initialize();
          closeAllPopups();
          setCurrentResource(null);
        })
    }
  };

  const editClicked = ({ id }) => {
    setIsEditSource(true);
    sourceApiOBJ.getSourceInfo(id)
      .then((data) => {
        if (data) {
          setCurrentResource(data);
        }
      })
      .catch((error) => {
        if (error) {
          console.log(error);
        }
      })
      .finally(() => {
        setIsAddSourcePopupOpen(true);
      });
  };

  const deleteClicked = ({ id }) => {
    setIsConfirmLoginPopupOpen(true);
    setCurrentResource({ idToDelete: id });
  };

  // ???????????????????????????????????????????????????
  // !!!!!!!!!!!!!     ROUTE handling     !!!!!!!!!!!!!!
  // ???????????????????????????????????????????????????
  const setIsRefreshTrue = () => setIsRefresh(true);

  const buttons = [
    {
      name: 'refresh',
      onClick: setIsRefreshTrue,
    },
  ];

  const rightClickItems = [
    { buttonText: 'delete resource', buttonClicked: deleteClicked, filter: 'resource' },
    { buttonText: 'sign out', buttonClicked: handleLogout, filter: 'header' },
    { buttonText: 'edit resource', buttonClicked: editClicked, filter: 'resource' },
    { buttonText: 'add resource', buttonClicked: openPopup, filter: 'resources' },
    { buttonText: 'refresh', buttonClicked: setIsRefreshTrue, filter: 'app' },
  ];

  // ???????????????????????????????????????????????????
  // !!!!!!!!!!!!!     EVENT handling     !!!!!!!!!!!!!!
  // ???????????????????????????????????????????????????
  React.useEffect(() => { // * close popup when clicked ESCAPE
    const closeByEscape = (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    };

    document.addEventListener('keydown', closeByEscape);
    return () => document.removeEventListener('keydown', closeByEscape);
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => { // * close popup when clicked outside of it
    const closeByClick = (evt) => {
      if (evt.target.classList.contains("popup")) {
        closeAllPopups();
      }
    }

    document.addEventListener('mouseup', closeByClick);
    return () => document.removeEventListener('mouseup', closeByClick);
  });

  // ???????????????????????????????????????????????????
  // !!!!!!!!!!!!!     INIT handling     !!!!!!!!!!!!!!!
  // ???????????????????????????????????????????????????
  React.useEffect(() => {
    isAutoLogin();
    initialize();
  }, []);

  React.useEffect(() => { // * starting the interval to check for new sources
    const interval = setInterval(() => {
      initialize();
    }, (10 * 1000));
    return () => clearInterval(interval);
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentResourceContext.Provider value={{ currentResource }}>
        <RightClickMenu items={rightClickItems} />
        <div className="app">
          <Header
            noScroll={noScroll}
            scroll={scroll}
            isLoggedIn={false}
            navBarButtons={buttons}
            handleButtonClick={openPopup}
            theme={true}
            isHomePage={false}
          />
          {loggedIn ? <h3 className='app__title'>{currentUser.username}, welcome back!</h3> : <></>}
          <div className='resources'>
            {resources[0] ? resources.map((resource, index) => {
              return <Resource isRefresh={isRefresh} resource={resource} key={index} onClick={resourceClick} />
            }) : <></>}
          </div>

          <LoginPopup
            handleLogin={handleLoginSubmit}
            isOpen={isLoginPopupOpen}
            isFound={isUserFound}
            linkText='Add source'
            onClose={closeAllPopups}
            handleSwitchPopup={switchPopups}
            onSignOut={handleLogout}
          />

          <ConfirmPopup
            isOpen={isConfirmPopupOpen}
            isDeleteSource={true}
            onClose={closeAllPopups}
            handleSubmit={deleteSource}
          />

          <AddSourcePopup
            isLoggedIn={loggedIn}
            onSubmit={isEditSource ? editSource : handleAddSourceSubmit}
            isOpen={isAddSourcePopupOpen}
            linkText='Sign in'
            popupTitle={isEditSource ? "Edit source" : "Add source"}
            handleSwitchPopup={switchPopups}
            onClose={closeAllPopups}
          />
        </div>
        <Footer />
      </CurrentResourceContext.Provider>
    </CurrentUserContext.Provider >
  );
};
