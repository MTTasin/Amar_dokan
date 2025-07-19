import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../features/auth/authslice";
import { useEffect } from "react";
import Loader from "../Components/Loader/Loader";

export default function Profile() {
    const dispatch = useDispatch();
    const { user, userInfo, isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Your Profile</h1>

                <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                    <div className="flex items-center space-x-6 mb-6">
                        <div className="flex-shrink-0">
                            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-5xl font-bold">
                                {userInfo.first_name ? userInfo.first_name.charAt(0).toUpperCase() : ''}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-semibold text-gray-900">{userInfo.first_name} {userInfo.last_name}</h2>
                            <p className="text-gray-600 text-lg">{userInfo.email}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 font-medium">First Name:</p>
                                <p className="text-gray-800 text-lg">{userInfo.first_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 font-medium">Last Name:</p>
                                <p className="text-gray-800 text-lg">{userInfo.last_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 font-medium">Email:</p>
                                <p className="text-gray-800 text-lg">{userInfo.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 font-medium">Account Status:</p>
                                <p className={`text-lg font-semibold ${userInfo.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                    {userInfo.is_active ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 font-medium">Staff Member:</p>
                                <p className={`text-lg font-semibold ${userInfo.is_staff ? 'text-green-600' : 'text-red-600'}`}>
                                    {userInfo.is_staff ? 'Yes' : 'No'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}