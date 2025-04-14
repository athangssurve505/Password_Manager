import { useState } from 'react'
import './App.css'
import "./Page/Main_Page"
import Main_Page from './Page/Main_Page'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Main_Page/>
    </>
  )
}

export default App
