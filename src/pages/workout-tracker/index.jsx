import { useState } from "react";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { signOut } from "firebase/auth";
import axios from "axios";
import './style.css';

const Questionaire = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const { name, profilePhoto } = useGetUserInfo();

    const signUserOut = async () => {
        try {
            await signOut(auth);
            localStorage.clear();
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };


    
    const createPrompt = (event) => {
        let weight = document.getElementById('Weight').value;
        let height = document.getElementById('Height').value;
        let currentActivityLevel = document.getElementById('Current-Activity-Level').value;
        let fitnessGoal = document.getElementById('Fitness-Goal').value;
        let medical = document.getElementById('Medical').value;
        let prompt = "Create a weekly workout plan based on the following information: \nWeight: " + weight + " pounds\nHeight: " + height + " inches\nCurrent Activity Level: " + currentActivityLevel + "\nFitness Goal: " + fitnessGoal + "\nPre-existing Medical Conditions: " + medical;
        event.preventDefault();
        console.log(prompt);

        // Make the API call
        callOpenAI(prompt);
    };

    const callOpenAI = async (prompt) => {
        try {
            const openaiEndpoint = 'https://api.openai.com/v1/engines/davinci/completions';
            const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY; // Make sure to replace this with your actual API key

            const response = await axios.post(
                openaiEndpoint,
                {
                    prompt: prompt,
                    max_tokens: 150 // Adjust as needed
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openaiApiKey}`
                    }
                }
            );

            const workout = response.data.choices[0].text.trim();
            console.log(`Workout:`);
            console.log(workout);
        } catch (error) {
            console.error('Error calling OpenAI:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <>
            <div className="questionaire-page">
                <div className="profile">
                    <img className="profile-photo" src={profilePhoto} alt="Profile" />
                    <p>{name}</p>
                    <button className="sign-out-button" onClick={signUserOut}>
                        Sign Out
                    </button>
                </div>

                <form className="questionaire-container" onSubmit={createPrompt}>
                    <label htmlFor="Gender">Gender</label>
                <select id="Gender" name="gender" value={selectedOption} onChange={handleChange}>
                    <option value="">Not Listed</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                    <label htmlFor="Weight">Weight (lbs)</label>
                    <input type = "text" id = "Weight" required></input>
                    <label htmlFor="Height">Height (in)</label>
                    <input type = "text" id = "Height" required></input>
                    <label htmlFor="Current-Activity-Level">Current Activity Level</label>
                    <input type = "text" id = "Current-Activity-Level" required></input>
                    <label htmlFor="Fitness-Goal">Fitness Goal</label>
                    <input type = "text" id = "Fitness-Goal" required></input>
                    <label htmlFor="Medical">Medical Conditions/Injuries</label>
                    <input type = "text" id = "Medical" required></input>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </>
    );
};
export default Questionaire;
/*
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
            <input type = "text" id = "Height" required></input>
            <label htmlFor="Current-Activity-Level">Current Activity Level</label>
            <input type = "text" id = "Current-Activity-Level" required></input>
            <label htmlFor="Fitness-Goal">Fitness Goal</label>
            <input type = "text" id = "Fitness-Goal" required></input>
            <label htmlFor="Medical">Medical Conditions/Injuries</label>
            <input type = "text" id = "Medical" required></input>
            <input type="Submit"></input>
        </form>
        </div>
        </>
    )
}
*/