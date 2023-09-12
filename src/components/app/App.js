import React from 'react';
import { Route, Switch, withRouter, useHistory } from 'react-router-dom';
import ProtectedRoute from '../protectedRoute/ProtectedRoute';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import CurrentResourceContext from '../../contexts/CurrentResourceContext';
import LastEntryContext from '../../contexts/LastEntryContext';
import sourceApiOBJ from '../../utils/sourceApi';
import usersApiOBJ from '../../utils/usersApi';
import collectionApiObj from '../../utils/collectionApi';
import * as auth from '../../utils/auth';
import { theTeam } from '../../constants/constants';
import Header from '../header/Header';
import AboutUs from '../aboutus/AboutUs';
import WatchResource from '../watchResource/WatchResource';
import RightClickMenu from '../rightClickMenu/RightClickMenu';
import Main from '../main/Main';
import LoginPopup from '../popup/LoginPopup';
import ConfirmPopup from '../popup/ConfirmPopup';
import AddSourcePopup from '../popup/AddSourcePopup';
import PopupSettings from '../popup/PopupSettings';
import Footer from '../footer/Footer';
import * as Buttons from '../buttons/Buttons';
import * as Svgs from '../../images/SvgComponents';

function App() {
  const currentUserContext = React.useContext(CurrentUserContext);    // eslint-disable-line
  const currentResourceContext = React.useContext(CurrentResourceContext);    // eslint-disable-line
  const lastEntryContext = React.useContext(LastEntryContext);    // eslint-disable-line
  const safeDocument = typeof document !== 'undefined' ? document : {};
  const html = safeDocument.documentElement;
  const history = useHistory();
  const [resources, setResources] = React.useState([]);
  const [isUserFound, setIsUserFound] = React.useState(true);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(undefined);
  const [currentResource, setCurrentResource] = React.useState(undefined);
  const [lastEntry, setLastEntry] = React.useState(undefined);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmLoginPopupOpen] = React.useState(false);
  const [isAddSourcePopupOpen, setIsAddSourcePopupOpen] = React.useState(false);
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = React.useState(false);
  const [isRefresh, setIsRefresh] = React.useState(false);
  const [isFromZero, setIsFromZero] = React.useState(true);
  const [isCapacity, setIsCapacity] = React.useState(true);
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
    setIsSettingsPopupOpen(false);
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

  const openSettings = () => setIsSettingsPopupOpen(true);

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
          initialize();
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
            getAllEntries(data.url);
            getLastEntry(data.url);
            history.push(`/resource/${id}`);
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
  const deleteCollection = (name) => {
    return collectionApiObj.deleteCollection(name)
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      })
  };

  const getLastEntry = (url) => {
    collectionApiObj.getLastEntry(url)
      .then((data) => {
        if (data.message === "Entry found") {
          setLastEntry(data.entry)
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  const getAllEntries = (url) => {
    setIsPreloader(true);
    collectionApiObj.getEntries(url)
      .then(({ data, found }) => {
        if (found !== 0) {
          setChartData(data);
          setIsPreloader(false);
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
    getSource(id, true);
  };

  const handleHomeClick = () => {
    history.push('/');
    setCurrentResource(undefined);
    setLastEntry(undefined);
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
        setCurrentResource(undefined);
        setLastEntry(undefined);
      }
    },
  ];

  const rightClickItems = [
    { buttonText: 'refresh', buttonClicked: setIsRefreshTrue, filter: 'root', isAllowed: true },
    { buttonText: 'sign out', buttonClicked: handleLogout, filter: 'header', isAllowed: true },
    { buttonText: 'add resource', buttonClicked: openPopup, filter: 'resources', isAllowed: true },
    { buttonText: 'open settings', buttonClicked: openSettings, filter: 'root', isAllowed: false },
    { buttonText: 'edit resource', buttonClicked: editClicked, filter: 'resource', isAllowed: false },
    { buttonText: 'watch resource', buttonClicked: handleWatchResource, filter: 'resource', isAllowed: true },
    { buttonText: 'delete resource', buttonClicked: deleteClicked, filter: 'resource', isAllowed: false },
  ];

  // ???????????????????????????????????????????????????
  // !!!!!!!!!!!!     SETTINGS handling     !!!!!!!!!!!!
  // ???????????????????????????????????????????????????
  const setSettings = (settings) => {
    if (settings) {
      setIsFromZero(settings.yAxis === 'zero');
      setIsCapacity(settings.watch === 'capacity');
      closeAllPopups();
    }
  };

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
    }, (20 * 1000));
    return () => clearInterval(interval);
  }, []);       //eslint-disable-line

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentResourceContext.Provider value={currentResource}>
        <LastEntryContext.Provider value={lastEntry}>
          <Header
            noScroll={noScroll}
            scroll={scroll}
            isLoggedIn={false}
            buttons={buttons}
            handleButtonClick={openPopup}
            theme={true}
          />

          <div className="settings-button__container">
            <Buttons.ButtonSVG title='Reload' buttonText="Settings" onClick={openSettings}  >
              <Svgs.SvgSettings classes='setting__button-class' />
            </Buttons.ButtonSVG>
          </div>

          <Switch>
            <Route exact path='/'>
              <Main
                resources={resources.length !== 0 ? resources : []}
                isRefresh={isRefresh}
                resourceClick={resourceClick}
                switchPopups={switchPopups}
              />
            </Route>

            <Route path='/about-us'>
              <AboutUs
                people={theTeam}
                title='Geomage'
                subtitle="Geomage is a company founded in 2003."
              />
            </Route>

            <ProtectedRoute path={`/resource/${currentResource ? currentResource._id : ''}`} loggedIn={loggedIn && window.innerWidth >= 530}>
              <WatchResource
                chartData={chartData}
                resourceClick={resourceClick}
                isFromZero={isFromZero}
                isPreloader={isPreloader}
                setIsPreloader={setIsPreloader}
                isCapacity={isCapacity}
              />
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

          <PopupSettings
            isOpen={isSettingsPopupOpen}
            onClose={closeAllPopups}
            handleSubmit={setSettings}
          />
          <RightClickMenu items={rightClickItems} isLoggedIn={loggedIn} />
          <Footer homeClick={handleHomeClick} />
        </LastEntryContext.Provider>
      </CurrentResourceContext.Provider>
    </CurrentUserContext.Provider >
  );
};
export default withRouter(App);
