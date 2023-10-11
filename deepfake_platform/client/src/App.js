import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageUpload from "./ImageUpload";
import ImageGallery from "./ImageGallery";
import MainPage from "./MainPage";
import Header from "./Header";
import Footer from "./Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/upload" element={<ImageUpload />} />
        <Route path="/gallery" element={<ImageGallery />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
