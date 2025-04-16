import { useCallback, useEffect, useState, createContext } from 'react'
import './App.css'
import { IconButton, Progress, setDarkModeActivation } from 'nes-ui-react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { Sun, Moon, MenuIcon } from './components/Icons'
import { useLoading } from './context/LoadingContext'
import { get, post } from './lib/reqUtils'
import jwt_decode from "jwt-decode";
import { socket } from './lib/clientSocket'
import { UserContextType } from './lib/models/context'
import { LoadUserInfo, SaveUserInfo } from './components/Utils'

export const UserContext = createContext({} as UserContextType);

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { isLoading } = useLoading()
  const [userId, setUserId] = useState(undefined);
  const [userName, setUserName] = useState(undefined);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // LoadUserInfo()
    get("/api/whoami").then((user:any) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
        setUserName(user.name);
        setUser(user);
      } else {
        // they are not logged in.
        setUserId(undefined);
        setUserName(undefined);
        setUser(undefined);
      }
    });
  }, []);

  const handleLogin = (credentialResponse: { credential?: any }) => {
    if (!credentialResponse.credential) {
      console.error("No credential found");
      return;
    }
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken) as { name: string };
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user:any) => {
      setUserId(user._id);
      setUserName(user.name);
      setUser(user);
      // SaveUserInfo(user);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  const authContextValue = {
    userId,
    userName,
    user,
    isLoggedIn: !!userId,
    handleLogin,
    handleLogout,
  };

  const [progressVal] = useState(0)

  const toggleDarkMode = useCallback(
    () => setDarkMode((darkMode) => !darkMode),
    [darkMode]
  )

  useEffect(() => setDarkModeActivation(darkMode), [darkMode])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setProgressVal((prev) => (prev + (100 - prev) / 2));
  //   }, 100);

  //   return () => {
  //     setProgressVal(0);
  //     clearInterval(interval);
  //   }
  // }, [isLoading])

  useEffect(() => {
    console.log(location)
  }, [location])

  const NavigatorItems = () => (
    <>
      <NavLink to="/" className={`text-base `} >主页</NavLink>
      <NavLink to="/gallery" className={`text-base `}>猫窝</NavLink>
      <NavLink to="/settings" className={`text-base `}>设置</NavLink>
      <NavLink to="/about" className={`text-base `}>关于</NavLink>
    </>
  )

  return (
    <UserContext.Provider value={authContextValue}>
    <div className="min-h-screen">
      <div className="sticky w-screen left-0 top-0 z-50">
        <div className="w-screen left-0 top-0 z-50 p-3 bg-auto toolbar">
          <div className="max-w-lg flex mx-auto items-center">
            <span className="text-xl flex-1">CatLin <sup className="text-sm">=^·.·^=</sup></span>
            <nav className="md:flex gap-3 hidden mr-3">
              <NavigatorItems />
            </nav>
            <IconButton color="warning" borderInverted onClick={toggleDarkMode}>
              {darkMode ? <Sun /> : <Moon />}
            </IconButton>
            <IconButton color="primary" borderInverted className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <MenuIcon />
            </IconButton>
          </div>
          <div className={`max-w-lg mx-auto items-center justify-end mt-1 mr-3 gap-3 ${menuOpen ? 'flex md:hidden' : 'hidden'}`}>
            <NavigatorItems />
          </div>
        </div>
        <Progress value={progressVal} max="100" color="primary"
          style={{
            margin: "0",
            height: "8px",
            display: "flex",
            // opacity: progressVal === 0? '0%':'100%',
            transition: "opacity 200ms ease",
          }}
        />
      </div>
      <div className={`flex gap-3 items-center justify-center flex-col ${location.pathname === '/' ? 'm-0 h-auto' : 'm-3'}`}>
        <Outlet />
      </div>
    </div>
    </UserContext.Provider>
  )
}

export default App
