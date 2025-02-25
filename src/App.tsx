import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { IconButton, setDarkModeActivation } from 'nes-ui-react'
import { NavLink, Outlet } from 'react-router'
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
      <NavLink to="/" className="text-base">主页</NavLink>
      {/* <NavLink to="/gallery" className="text-base">画廊</NavLink> */}
      <NavLink to="/settings" className="text-base">设置</NavLink>
      <NavLink to="/about" className="text-base">关于</NavLink>
    </>
  )

  return (
    <>
      <div className="sticky w-screen left-0 top-0 z-50 p-3 bg-gray-50 bg-inherit"
        style={{
          borderBottom: "4px solid #D3D3D3"
        }}
      >
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
      <div className="flex gap-3 items-center justify-center flex-col m-3">
        <Outlet />
      </div>
    </>
  )
}

export default App
