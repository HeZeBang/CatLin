"use client";

import { useCallback, useEffect, useState, createContext } from 'react'
import './App.css'
import { IconButton, Progress, setDarkModeActivation } from 'nes-ui-react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { Sun, Moon, MenuIcon } from './components/Icons'
import { useLoading } from './context/LoadingContext'
import { get } from './lib/fetcher'
import jwt_decode from "jwt-decode";
import { UserContextType } from './models/context'
import { toast, Toaster } from 'sonner'
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'
import useSWR from 'swr';

export const UserContext = createContext({} as UserContextType);

function MainApp() {
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { data: session, update } = useSession();

  const fetcher = (...args: [RequestInfo | URL, RequestInit?]) => fetch(...args).then((res) => res.json())
  const userFetcher = (...args: [RequestInfo | URL, RequestInit?]) => fetch(...args).then((res) => res.json()).then((res) => res.user)
  const useUser = () =>
    useSWR("/api/user/config", userFetcher)

  const { data: user, error, isLoading } = useUser()

  useEffect(() => {
    if (user) {
      update({ user: user })
    }
  }, [user])

  // useEffect(() => {
  //   // LoadUserInfo()
  //   get("/api/user/config")
  //     .then((res: any) => res.data)
  //     .then((user: any) => {
  //       if (user._id) {
  //         // they are registed in the database, and currently logged in.
  //         update({ user: user })
  //       } else {
  //         // they are not logged in.
  //         // setUser(undefined);
  //       }
  //     });
  // }, [location]);

  const handleLogin = (credentialResponse: { credential?: any }) => {
    if (!credentialResponse.credential) {
      console.error("No credential found");
      return;
    }
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken) as { name: string };
    signIn("google", {
      credential: userToken,
      redirect: false
    })
      .catch((error) => {
        toast.error("Error logging in: " + error.message);
      });
  };

  const handleLogout = () => {
    signOut({ redirect: false });
  };

  const authContextValue: UserContextType = {
    userId: session?.user?._id,
    userName: session?.user?.name,
    user: session?.user,
    isLoggedIn: !!session?.user,
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

  // useEffect(() => {
  //   console.log(location)
  // }, [location])

  const NavigatorItems = () => (
    <>
      <NavLink to="/" className={`text-base text-current`} >主页</NavLink>
      <NavLink to="/gallery" className={`text-base text-current`}>猫窝</NavLink>
      <NavLink to="/settings" className={`text-base text-current`}>设置</NavLink>
      <NavLink to="/about" className={`text-base text-current`}>关于</NavLink>
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
              <IconButton color={darkMode ? "warning" : "primary"} borderInverted onClick={toggleDarkMode}>
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
        <div className={`flex items-center justify-center flex-col ${location.pathname === '/' ? 'm-0 h-auto' : 'm-3 mb-0'}`}>
          <Outlet />
          <Toaster
            visibleToasts={5}
            toastOptions={{
              style: {
                borderImageSource: "var(--pixel-borders-image-2-color-black-absolute)",
                borderImageSlice: 4,
                borderWidth: "4px",
              }
            }}
          />
        </div>
      </div>
      {/* <GoogleOneTap /> */}
    </UserContext.Provider>
  )
}

function App() {
  return (
    <SessionProvider session={undefined}>
      <MainApp />
    </SessionProvider>
  )
}

export default App
