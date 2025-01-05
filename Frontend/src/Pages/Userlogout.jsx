import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Userlogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/user/logout`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (token) {
                    localStorage.removeItem('token');
                    navigate('/');  // Redirect to homepage after successful logout
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }
        };

        logout();
    }, [navigate]);

    return <div>Logging out...</div>;
};

export default Userlogout;
