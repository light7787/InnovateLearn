import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    
    const login = async ( email, password ) => { // Accept email and password here
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://innovate-learn-v1ki.vercel.app/api/login', {
                method: 'POST',credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error || 'Invalid credentials');
                return;
            }

            // Save user data and update global state
            localStorage.setItem('user', JSON.stringify(json));
            window.dispatchEvent(new Event('storage'));
            navigate('/');

        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return { login, error, isLoading };
};
