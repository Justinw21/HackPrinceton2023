import { useState } from "react";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { signOut } from "firebase/auth";
import './style.css';

export const Questionaire = () =>{
    const navigate = useNavigate();
    const signUserOut = async () => {
        try {
          await signOut(auth);
          localStorage.clear();
          navigate("/");
        } catch (err) {
          console.error(err);
        }
      };

    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const { name, profilePhoto } = useGetUserInfo(); //saves user name and pic
    return(
        <>
        <div className="questionaire-page">
                <div className="profile">
                    {" "}
                    <img className="profile-photo" src={profilePhoto} />
                    <p>{name}</p>
                    <button className="sign-out-button" onClick={signUserOut}>
                    Sign Out
                    </button>
                </div>

        <form className="questionaire-container">
            <label htmlFor="Gender">Gender</label>
            <select id="Gender" name="gender" value={selectedOption} onChange={handleChange}>
                <option value="">Not Listed</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <label htmlFor="Weight">Weight (lbs)</label>
            <input type = "text" id = "Weight" required></input>
            <label htmlFor="Height">Height (in)</label>
            <label htmlFor="Current-Activity-Level"></label>
            <input type = "text" id = "Current-Activity-Level" required></input>
            <label htmlFor="Fitness-Goal">Fitness Goal</label>
            <input type = "text" id = "Fitness-Goal" required></input>
            <input type="Submit"></input>
        </form>
        </div>
        </>
    )
}