import React, { useState, useContext } from 'react';
import axiosInstance from './../axiosInstance';
import AuthContext from './../AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance.post('/accounts/login/', { email, password })
            .then(response => {
                setUser(response.data.user);
                localStorage.setItem('token', response.data.token);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;