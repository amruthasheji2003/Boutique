// src/App.js
import React from 'react';
import './App.css'; // Import global CSS
import { Outlet } from 'react-router-dom';
// import Header  from './components/Header';
import Footer  from './components/Footer';
function App() {
  return (
    <>
   {/* <Header/> */}
   <main className='min-h-[calc(100vh-60px)] pt-0'>
   <Outlet/>
   </main>
   <Footer/> 
    </>
  );
}

export default App;
