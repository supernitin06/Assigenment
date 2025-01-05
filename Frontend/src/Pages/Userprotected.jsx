import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Userprotected = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
      
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]); 
    
    return token ? <>{children}</> : null;
};

export default Userprotected;
