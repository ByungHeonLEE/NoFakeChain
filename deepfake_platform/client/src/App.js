import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';
import MainPage from './MainPage';

function App() {
  return (
    <div className='App'>
      <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path="/upload" element ={<ImageUpload />} />
          <Route path="/gallery" element = {<ImageGallery />} />
      </Routes>
    </div>
  );
}

export default App;