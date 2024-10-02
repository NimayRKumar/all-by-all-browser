import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { GWASPage } from './pages/GWASPage'
import { EXWASPage } from './pages/EXWASPage'

export const RoutesPage = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/gwas/:name' element={<GWASPage/>}/>
        <Route path='/exwas/:name' element={<EXWASPage/>}/>
      </Routes>
    </Router>
  )
}