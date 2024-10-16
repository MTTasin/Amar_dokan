import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice";
import { useEffect } from "react";


export default function Profile() {
    const dispatch = useDispatch();
    const { user, userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch]);

      

    return(
        <>
            <h1>Welcome to your Profile Page {userInfo.first_name} {userInfo.last_name}</h1>
        </>
    )
}