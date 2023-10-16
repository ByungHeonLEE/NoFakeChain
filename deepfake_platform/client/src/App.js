import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ImageUpload from "./ImageUpload";
import ImageGallery from "./ImageGallery";
import MainPage from "./MainPage";
import Header from "./Header";
import Footer from "./Footer";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/upload" element={<ImageUpload />} />
          <Route path="/gallery" element={<ImageGallery />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
