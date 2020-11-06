import React from 'react'

function App() {
  const changeRoute = (pathname) => {
    history.pushState({}, '', pathname)
  }

  return (
    <div>
      <header className="header">
        <button onClick={() => changeRoute('/react')}>React</button>
        <button onClick={() => changeRoute('/vue')}>Vue</button>
      </header>
      <child-react></child-react>
      <child-vue></child-vue>
    </div>
  )
}

export default App
