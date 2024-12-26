import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center bg-gray-50 py-16 px-6">
        <div className="flex flex-col justify-center items-start md:pl-16 space-y-6">
          <h1 className="text-blue-600 text-4xl md:text-5xl font-extrabold leading-snug">
            Learn, grow, and achieve—
            <br />
            where knowledge meets innovation.
          </h1>
        </div>
        <div className="flex justify-center items-center pt-10 md:pt-0">
          <img
            className="w-60 md:w-80"
            src="/undraw_reading-time_gcvc.svg"
            alt="Reading illustration"
          />
        </div>
      </div>

      {/* Courses Section */}
      <div className="px-6 py-8">
        <h2 className="text-blue-600 text-3xl font-bold text-center">Courses</h2>
        <hr className="border-t-4 border-blue-600 my-6 mx-auto w-2/3" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
          <Link to="/cplusplus">
            <img
              className="w-20 sm:w-28 hover:scale-110 transition-transform duration-300"
              src="/c.svg"
              alt="C++ Course"
            />
          </Link>
          <Link to="/js">
            <img
              className="w-20 sm:w-28 hover:scale-110 transition-transform duration-300"
              src="/logo-javascript.svg"
              alt="JavaScript Course"
            />
          </Link>
          <img
            className="w-20 sm:w-28 hover:scale-110 transition-transform duration-300"
            src="/python-5.svg"
            alt="Python Course"
          />
          <Link to="/dsasheet">
            <img
              className="w-20 sm:w-28 hover:scale-110 transition-transform duration-300"
              src="/Dsa.png"
              alt="DSA Sheet"
            />
          </Link>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12 px-6">
          <div className="flex justify-center">
            <img
              className="w-48 md:w-60"
              src="/undraw_teacher_s628.svg"
              alt="Teacher illustration"
            />
          </div>
          <div className="text-center md:text-left text-white space-y-6">
            <h3 className="text-3xl font-bold">Start For Free</h3>
            <p className="text-lg leading-relaxed">
              If you've made it this far, you must be at least a little curious.
              Sign up and take the first step toward your goals.
            </p>
            <Link to="/signup">
              <button className="px-6 py-2 bg-amber-400 text-black font-semibold rounded-lg shadow-md hover:bg-amber-500 transition duration-300">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Home;
