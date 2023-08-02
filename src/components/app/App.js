import React from 'react';
import { Route, Switch, withRouter, useHistory } from 'react-router-dom';
import ProtectedRoute from '../protectedRoute/ProtectedRoute';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import CurrentResourceContext from '../../contexts/CurrentResourceContext';
import sourceApiOBJ from '../../utils/sourceApi';
import usersApiOBJ from '../../utils/usersApi';
import collectionApiObj from '../../utils/collectionApi';
import * as auth from '../../utils/auth';
import Header from '../header/Header';
import * as Buttons from '../buttons/Buttons';
import RightClickMenu from '../rightClickMenu/RightClickMenu';
import Resource from '../resource/Resource';
import * as Charts from '../chart/Charts';
import { formatMemory, formatDate } from '../../constants/functions';
import Preloader from '../preloader/Preloader';
import LoginPopup from '../popup/LoginPopup';
import ConfirmPopup from '../popup/ConfirmPopup';
import AddSourcePopup from '../popup/AddSourcePopup';
import Footer from '../footer/Footer';

function App() {
  const currentUserContext = React.useContext(CurrentUserContext);    // eslint-disable-line
  const currentResourceContext = React.useContext(CurrentResourceContext);    // eslint-disable-line
  const safeDocument = typeof document !== 'undefined' ? document : {};
  const html = safeDocument.documentElement;
  const history = useHistory();
  const [resources, setResources] = React.useState([]);
  const [isUserFound, setIsUserFound] = React.useState(true);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(undefined);
  const [currentResource, setCurrentResource] = React.useState(undefined);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmLoginPopupOpen] = React.useState(false);
  const [isAddSourcePopupOpen, setIsAddSourcePopupOpen] = React.useState(false);
  const [isRefresh, setIsRefresh] = React.useState(false);
  const [isPreloader, setIsPreloader] = React.useState(false);
  const [isEditSource, setIsEditSource] = React.useState(false);
  const [chartData, setChartData] = React.useState();

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
      if (evt.target.classList.contains('signin')) {
        setIsLoginPopupOpen(true);
      } else {
        setIsAddSourcePopupOpen(true);
      }
    }
  };

  // ???????????????????????????????????????????????????
  // !!!!!!!!!!!!!     SOURCE handling     !!!!!!!!!!!!!
  // ???????????????????????????????????????????????????
  const deleteSource = (prop) => {
    sourceApiOBJ.deleteSource(prop !== undefined ? prop.id : currentResource.idToDelete)
      .then((source) => {
        if (source.totalMemory !== undefined) {
          deleteCollection(source.name);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      })
      .finally(() => {
        closeAllPopups();
        initialize();
        setCurrentResource(undefined);
      });

  };

  const resourceClick = (resource, hidePreloader) => {
    setIsPreloader(true);
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
      .then((data) => {
        if (data) {
          createCollection(data.name)
            .finally(() => {
              initialize();
            });
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
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

  const initialize = async () => {
    try {
      const data = await sourceApiOBJ.init();
      if (data) {
        setResources(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsRefresh(false);
      scroll();
    }
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

  const getSource = (id, isWatch = false) => {
    return sourceApiOBJ.getSourceInfo(id)
      .then((data) => {
        if (data) {
          setCurrentResource(data);
          if (isWatch) {
            getAllEntries(data.name);
          }
        }
      })
      .catch((error) => {
        if (error) {
          console.log(error);
        }
      })
  };

  const editClicked = ({ id }) => {
    setIsEditSource(true);
    getSource(id)
      .finally(() => {
        setIsAddSourcePopupOpen(true);
      });
  };

  const deleteClicked = ({ id }) => {
    setIsConfirmLoginPopupOpen(true);
    setCurrentResource({ idToDelete: id });
  };

  // ???????????????????????????????????????????????????
  // !!!!!!!!!!!     COLLECTION handling     !!!!!!!!!!!
  // ???????????????????????????????????????????????????
  const createCollection = (name) => {
    return collectionApiObj.createCollection(name)
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      })
  };

  const deleteCollection = (name) => {
    return collectionApiObj.deleteCollection(name)
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      })
  };

  const getAllEntries = (name) => {
    collectionApiObj.getEntries(name)
      .then(({ data, found }) => {
        if (found !== 0) {
          setChartData(data);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  // ???????????????????????????????????????????????????
  // !!!!!!!!!!!!!     ROUTE handling     !!!!!!!!!!!!!!
  // ???????????????????????????????????????????????????
  const setIsRefreshTrue = () => setIsRefresh(true);

  const handleWatchResource = ({ id }) => {
    history.push(`/resource/${id}`);
    getSource(id, true);
  };

  const handleHomeClick = () => {
    history.push('/');
    setCurrentResource(undefined)
  };

  const buttons = [
    {
      name: 'Home',
      isAllowed: true,
      path: '/',
      onClick: handleHomeClick
    },
    {
      name: 'About us',
      isAllowed: true,
      path: '/about-us',
      onClick: () => {
        history.push('/about-us');
        setCurrentResource(undefined)
      }
    },
  ];

  const rightClickItems = [
    { buttonText: 'refresh', buttonClicked: setIsRefreshTrue, filter: 'root', isAllowed: true },
    { buttonText: 'sign out', buttonClicked: handleLogout, filter: 'header', isAllowed: true },
    { buttonText: 'add resource', buttonClicked: openPopup, filter: 'resources', isAllowed: true },
    { buttonText: 'edit resource', buttonClicked: editClicked, filter: 'resource', isAllowed: false },
    { buttonText: 'watch resource', buttonClicked: handleWatchResource, filter: 'memory', isAllowed: false },
    { buttonText: 'delete resource', buttonClicked: deleteClicked, filter: 'resource', isAllowed: false },
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
  React.useEffect(() => { // * initializing the user and resources
    isAutoLogin();
    initialize();
  }, []);       //eslint-disable-line

  React.useEffect(() => { // * starting the interval to check for new sources
    const interval = setInterval(() => {
      initialize();
    }, (10 * 1000));
    return () => clearInterval(interval);
  }, []);       //eslint-disable-line

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentResourceContext.Provider value={currentResource}>
        <Header
          noScroll={noScroll}
          scroll={scroll}
          isLoggedIn={false}
          buttons={buttons}
          handleButtonClick={openPopup}
          theme={true}
        />

        <Switch>
          <Route exact path='/'>
            <section name='home' id='home'>
              {loggedIn ? <h3 className='app__title'>{currentUser.username}, welcome back!</h3> : <h3 className='app__title'>Welcome.<br />To edit resources please <span className='signin' onClick={switchPopups}>sign in</span>.</h3>}
              <div className='resources' >
                {resources.length !== 0 ? resources.map((resource, index) => {
                  return <Resource isRefresh={isRefresh} resource={resource} key={index} onClick={resourceClick} />
                }) : <></>}
              </div>
            </section>
          </Route>

          <Route path='/about-us'>
            <section name='about-us' id='about-us'>
              <h1>Geomage</h1>
              <p>Geomage is a company founded in 2003.</p>
            </section>
          </Route>

          <ProtectedRoute path={`/resource/${currentResource ? currentResource._id : ''}`} loggedIn={loggedIn && window.innerWidth >= 530}>
            <h3 className='app__title'>https://{currentResource ? currentResource.url : ''}</h3>
            <div className="add-button__container">
              <Buttons.ButtonAdd title='Reload' buttonText="Reload" onClick={() => { resourceClick(currentResource, () => { setIsPreloader(false) }) }} />
            </div>
            <div>
              {isPreloader ?
                <Preloader />
                :
                <Charts.LineChart title={{ text: 'Time / Capacity' }} chartClass='app__chart' chartData={chartData} subtitle={false} />
              }
              <div className='app__resource_info-container'>
                {currentResource ? <div className='flex row width50 auto around'>
                  <p className='zero-margin'>Resource: <span className={`${currentResource ? (currentResource.isActive ? 'green' : 'red') : 'red'}`}>{currentResource ? (currentResource.isActive ? 'active' : 'not active') : 'not active'}</span></p>
                  <p className='zero-margin'>Status: <span className={`${currentResource.status === 200 ? 'green' : 'red'}`}>{currentResource ? currentResource.status : 'Not available'}</span></p>
                </div> : <></>}
                {currentResource ? <p className='zero-margin'>Available memory: {formatMemory(currentResource ? currentResource.memoryLeft : 0)} of {formatMemory(currentResource ? currentResource.totalMemory : 0)}</p> : <></>}
                {currentResource ? <p className='zero-margin'>Last checked: {formatDate(currentResource.lastChecked)}</p> : <></>}
                {currentResource ? (currentResource.status !== 200 ? <p className='zero-margin'>Last active: {formatDate(currentResource.lastActive)}</p> : <></>) : <></>}
              </div>
            </div>
          </ProtectedRoute>
        </Switch>

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
        <RightClickMenu items={rightClickItems} isLoggedIn={loggedIn} />
        <Footer homeClick={handleHomeClick} />
      </CurrentResourceContext.Provider>
    </CurrentUserContext.Provider >
  );
};
export default withRouter(App);
