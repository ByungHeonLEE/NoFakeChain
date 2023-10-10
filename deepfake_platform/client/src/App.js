import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';
import Header from './Header';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element ={<ImageUpload/>} />
          <Route path="/gallery" element = {<ImageGallery/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;