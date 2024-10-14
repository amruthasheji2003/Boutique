// src/App.js
import React from 'react';
import './App.css'; // Import global CSS
import { Outlet } from 'react-router-dom'; // Use Outlet for nested routes
import Footer from './components/Footer';
// import Header from './components/Header'; // Uncomment if you have a Header component

function App() {
  return (
    <>
      {/* <Header /> Uncomment if you want to use Header */}
      <main className='min-h-[calc(100vh-60px)] pt-0'>
        <Outlet /> {/* Render child routes here */}
      </main>
      <Footer />
    </>
  );
}

export default App;
