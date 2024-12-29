import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, getAuth, signInWithPopup, } from "firebase/auth";
import { app } from "../config/firebase"
import { signInSuccess } from "../features/auth/authSlice";


export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);;
            const res = await fetch('http://localhost:8080/api/users/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: result.user.displayName,
                    username: result.user.displayName,
                    email: result.user.email,
                }),
            });

            const data = await res.json();
            console.log(data);
            const { user, accessToken } = data.data; // Check if accessToken is present in the correct structure
            dispatch(signInSuccess({ user, accessToken }));
            
            navigate('/');
        } catch (error) {
            console.log('could not login with google', error);
        }
    }

    return(
        <button
        type="button"
        onClick={handleGoogleClick}
        >
            Sign in with Google
        </button>
    )
}