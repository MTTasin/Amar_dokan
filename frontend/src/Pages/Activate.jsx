import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { activate, reset } from '../features/auth/authslice'
import { toast } from 'react-toastify'


const Activate = () => {


    const { uid, token } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleSubmit = (e) => {
        e.preventDefault()

        const userData = {
            uid,
            token
        }
        dispatch(activate(userData))
        toast.success("Your account has been activated! You can login now")
    }

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess) {
            navigate("/login")
        }

        dispatch(reset())

    }, [isError, isSuccess, navigate, dispatch])


    return (
        <div>
            <div className="main">
                <h1 className="text-center text-3xl">Activate Account</h1>

                

                <button className="btn btn-primary w-full mx-auto max-w-xs mt-20" type="submit" onClick={handleSubmit}>Activate Account</button>
            </div>
        </div>
    )
}

export default Activate