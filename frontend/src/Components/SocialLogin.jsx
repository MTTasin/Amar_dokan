import React from 'react';

const SocialLogin = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/accounts/google/login/';
    };

    return (
        <button onClick={handleGoogleLogin}>Login with Google</button>
    );
};

export default SocialLogin;
