import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const signup = async (email, password) => {
    setIsLoading(true); // Indicate loading
    setError(null);     // Reset any previous error

    try {
      // Send POST request to API
      const response = await fetch('https://innovate-learn-v1ki.vercel.app/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Send email & password as JSON
      });

      const json = await response.json(); // Parse JSON response

      if (!response.ok) {
        setIsLoading(false); // Stop loading
        setError(json.error); // Set the error message
        return;
      }

      // Save the user token and email to local storage
      localStorage.setItem('user', JSON.stringify(json));
      window.dispatchEvent(new Event('storage'));
      navigate('/');



      setIsLoading(false); // Stop loading
    } catch (err) {
      setIsLoading(false);
      setError('Something went wrong');
    }
  };

  return { signup, isLoading, error }; // Expose the signup function and states
};
