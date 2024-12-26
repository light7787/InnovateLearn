import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <p className="mb-2">© {new Date().getFullYear()} DSA Learning Platform. All Rights Reserved.</p>
        <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <a href="#privacy" className="text-white text-decoration-none mx-2">
              Privacy Policy
            </a>
          </li>
          <li className="list-inline-item">
            <a href="#terms" className="text-white text-decoration-none mx-2">
              Terms of Service
            </a>
          </li>
          <li className="list-inline-item">
            <a href="#contact" className="text-white text-decoration-none mx-2">
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
