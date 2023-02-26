import * as React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AdminHome from '../pages/Home/AdminHome/AdminHome';
import Home from '../pages/Home/Home/Home';
import SignIn from '../pages/Signin';
import Signup from '../pages/Signup';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<SignIn />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/admin" element={<AdminHome />} />
        <Route exact path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
