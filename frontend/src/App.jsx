import React from 'react'
import {Routes, Route} from 'react-router-dom'
import CreateMovie from './pages/CreateMovie'
import DeleteMovie from './pages/DeleteMovie';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UpdateMovie from './pages/UpdateMovie';
import Home from './pages/Home';
import DetailMovie from './pages/DetailMovie';

export const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/user/signup' element={<Signup />}/>
      <Route path='/user/login' element={<Login />}/>
      <Route path='/movie/detail/:id' element={<DetailMovie />}/>
      <Route path='/movie/create' element={<CreateMovie />}/>
      <Route path='/movie/edit/:id' element={<UpdateMovie />}/>
      <Route path='/movie/delete/:id' element={<DeleteMovie />}/>
    </Routes>
  )
}

export default App;
