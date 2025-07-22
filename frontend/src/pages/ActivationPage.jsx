import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { activateUser, clearAuthStatus } from '../store/authSlice';
import Spinner from '../components/Spinner';
import { CheckCircle, XCircle } from 'lucide-react';

const ActivationPage = () => {
    const { uid, token } = useParams();
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (uid && token) {
            dispatch(activateUser({ uid, token }));
        }
        // Clear status on component unmount
        return () => {
            dispatch(clearAuthStatus());
        };
    }, [dispatch, uid, token]);

    const renderContent = () => {
        if (status === 'loading') {
            return (
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-text-secondary">Activating your account...</p>
                </div>
            );
        }

        if (status === 'succeeded') {
            return (
                <div className="text-center text-green-700">
                    <CheckCircle className="mx-auto h-16 w-16" />
                    <h2 className="mt-6 text-3xl font-anton text-text-primary">Account Activated!</h2>
                    <p className="mt-2 text-text-secondary">
                        Your account has been successfully activated. You can now log in.
                    </p>
                    <Link
                        to="/login"
                        className="mt-8 inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all"
                    >
                        Go to Login
                    </Link>
                </div>
            );
        }

        if (status === 'failed') {
            return (
                <div className="text-center text-red-700">
                    <XCircle className="mx-auto h-16 w-16" />
                    <h2 className="mt-6 text-3xl font-anton text-text-primary">Activation Failed</h2>
                    <p className="mt-2 text-text-secondary">
                        There was an error activating your account. The link may be invalid or expired.
                    </p>
                    <p className="mt-1 text-sm text-red-500">{error?.detail || 'Please try registering again.'}</p>
                    <Link
                        to="/register"
                        className="mt-8 inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all"
                    >
                        Go to Registration
                    </Link>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-light px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-border-light">
                {renderContent()}
            </div>
        </div>
    );
};

export default ActivationPage;
