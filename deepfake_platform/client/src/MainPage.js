import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const MainPage = () => {
    return (
        <div className="container mt-5">
            <header className="d-flex justify-content-between align-items-center mb-5">
                <h1>NoFakeChain</h1>
                <nav>
                    <Link to='/upload' className="btn btn-primary mr-2">Upload</Link>
                    <Link to='/gallery' className="btn btn-secondary">Gallery</Link>
                </nav>
            </header>
            <section>
                <h2>Welcome to NoFakeChain</h2>
                <p>
                    NoFakeChain is a platform dedicated to ensuring the authenticity of images. 
                    By leveraging the power of blockchain, we provide a robust solution to combat 
                    the spread of manipulated images. Upload your image and let our platform verify its genuineness.
                </p>
            </section>
        </div>        
    );
}

export default MainPage;