import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axiosInstance.get('/accounts/')
            .then(response => {
                setUser(response.data);
            })
            .catch(() => {
                setUser(null);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
