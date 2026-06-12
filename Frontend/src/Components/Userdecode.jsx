import React from 'react'
import jwtDecode from 'jwt-decode';

const Userdecode = () => {
   

const token = localStorage.getItem('token');
if (token) {
  const decoded = jwtDecode(token);
  const userId = decoded._id; // Extract the user ID
  console.log('User ID:', userId);
}

  return (
    <div></div>
  )
}

export default Userdecode