import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { Button, setDarkModeActivation } from 'nes-ui-react'
import gallery from './pages/Gallery'

function App() {
  const [count, setCount] = useState(0)
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = useCallback(
    () => setDarkMode((darkMode) => !darkMode),
    [darkMode]
  )

  useEffect(() => setDarkModeActivation(darkMode), [darkMode])

  return (
    <>
      <h1 className="text-5xl sm:text-8xl">CatLin</h1>
      <h2 className="text-2xl py-3">=＾● ⋏ ●＾=</h2>
      <div className="flex gap-3 items-center justify-center flex-col">
        <Button onClick={() => setCount((count) => count + 1)} className="text-xl">
          COUNT IS {count}
        </Button>
        <Button color="warning" borderInverted onClick={toggleDarkMode}>
          Dark Mode / 暗黑模式
        </Button>
        <p className="text-3xl">
          Welcome to CatLin Demo!
          <br />
          Here is the component gallery.
        </p>
        {gallery()}
      </div>
    </>
  )
}

export default App
