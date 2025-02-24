import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { IconButton, Menu, setDarkModeActivation } from 'nes-ui-react'
import { Outlet } from 'react-router'
import { Sun, Moon, MenuIcon } from './components/Icons'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const [menuOpen, setMenuOpen] = useState(false)

  const toggleDarkMode = useCallback(
    () => setDarkMode((darkMode) => !darkMode),
    [darkMode]
  )

  useEffect(() => setDarkModeActivation(darkMode), [darkMode])

  const NavigatorItems = () => (
    <>
      <a href="/" className="text-lg">主页</a>
      <a href="/gallery" className="text-lg">画廊</a>
    </>
  )

  return (
    <>
      <div className="sticky w-screen left-0 top-0 z-50 bg-inherit p-3 shadow-md">
        <div className="max-w-lg flex mx-auto items-center">
          <span className="text-lg flex-1">CatLin <sup className="text-lg">=^·.·^=</sup></span>
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
      <div className="flex gap-3 items-center justify-center flex-col m-3">
        <Outlet />
      </div>
    </>
  )
}

export default App
