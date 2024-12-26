import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return storedUser;
  });

  const handleClick = () => {
    logout();
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <nav className="w-full h-16 bg-blue-600 flex items-center justify-between px-6 shadow-md">
      <Link to="/">
        <h1 className="text-white font-extrabold text-3xl hover:text-gray-200 transition duration-200">
          Innovate Learn
        </h1>
      </Link>
      <div className="flex items-center gap-6 !text-white !no-underline font-medium text-lg">
        <Link to="/courses" className="hover:text-gray-300 transition duration-200">
          Courses
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/userinfo"
              className="hover:text-gray-300 transition duration-200"
            >
              {user.email}
            </Link>
            <button
              onClick={handleClick}
              className="bg-red-500 hover:bg-red-600 !text-white py-1 px-4 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 !text-white">
            <Link
              to="/signup"
              className="hover:text-gray-300 transition duration-200"
            >
              Signup
            </Link>
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 !text-white py-1 px-4 rounded-lg transition duration-200"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
