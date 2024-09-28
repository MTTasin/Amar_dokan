import { getUserInfo } from "../features/auth/authslice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";


export default function Dashboard() {
    const [userData, setUserData] = useState({});
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch]);

    

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/auth/users/me/", {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `JWT ${user.access}`,
                    "Accept": "application/json",
                },
            })
            .then((res) => {
                setUserData(res.data);
            });
    }, []);

    console.log(userData);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome {userData.first_name}</p>
        </div>
    );
}