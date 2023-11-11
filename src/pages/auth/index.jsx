import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import  backgroundImg  from '../../assets/running.jpg';
import "./styles.css";

export const Auth = () => {
  const navigate = useNavigate();
  const { isAuth } = useGetUserInfo();

  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider);
    const authInfo = {
      userID: results.user.uid,
      name: results.user.displayName,
      profilePhoto: results.user.photoURL,
      isAuth: true,
    };
    localStorage.setItem("auth", JSON.stringify(authInfo));
    navigate("/expense-tracker");
  };

  if (isAuth) {
    return <Navigate to="/expense-tracker" />;
  }

  return (
      <div className="login-page">
        
        <img src={ backgroundImg }></img>
        <div className="login-section">
            <h1>GitFit</h1>
            <h6>Health is just a click away</h6>
          <button className="login-with-google-btn" onClick={signInWithGoogle}>
            {" "}
            Sign In with Google
          </button>
        </div>
    </div>
  );
};
