import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageUpload from './ImageUpload';

function App() {
  return (
    <div className="App">
      <ImageUpload></ImageUpload>
    </div>
  );
}

export default App;