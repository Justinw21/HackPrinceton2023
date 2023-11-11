import React, { useState } from "react";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { signOut } from "firebase/auth";
import axios from "axios";
import TextField from "@mui/material/TextField";
import "./style.css";

const Questionaire = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [currentActivityLevel, setCurrentActivityLevel] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [weightError, setWeightError] = useState(false);
  const [heightError, setHeightError] = useState(false);
  
  const { name, profilePhoto } = useGetUserInfo();

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleWeightChange = (event) => {
    const inputValueW = event.target.value;
    const isValidInputW = /^\d+$/.test(inputValueW) && inputValueW >= 0 && inputValueW <= 1000;
    setWeight(inputValueW);
    setWeightError(!isValidInputW);
  };

  const handleHeightChange = (event) => {
    const inputValueH = event.target.value;
    const isValidInputH = /^\d+$/.test(inputValueH) && inputValueH >= 12 && inputValueH <= 120;
    setHeight(inputValueH);
    setHeightError(!isValidInputH);
  };

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
    event.preventDefault();
    const prompt =
      "Create a weekly workout plan based on the following information: \nWeight: " +
      weight +
      " pounds\nHeight: " +
      height +
      " inches\nCurrent Activity Level: " +
      currentActivityLevel +
      "\nFitness Goal: " +
      fitnessGoal +
      "\nPre-existing Medical Conditions: " +
      medicalConditions;
    console.log(prompt);

    // Make the API call
    callOpenAI(prompt);
  };

  const callOpenAI = async (prompt) => {
    try {
      const openaiEndpoint = "https://api.openai.com/v1/chat/completions";
      const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY; // Replace with your actual API key
  
      const response = await axios.post(
        openaiEndpoint,
        {
          model: 'gpt-3.5-turbo',
  
          messages: [
            {
              role: 'system',
              content: 'You are a personal trainer.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
        }
      );
  
      const workout = response.data.choices[0].message.content.trim();
      console.log(`Workout:`);
      console.log(workout);
    } catch (error) {
      console.error(
        "Error calling OpenAI:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <div className="questionaire-page">
        <div className="profile">
          <img
            className="profile-photo"
            src={profilePhoto}
            alt="Profile"
          />
          <p>{name}</p>
          <button className="sign-out-button" onClick={signUserOut}>
            Sign Out
          </button>
        </div>

        <form className="questionaire-container" onSubmit={createPrompt}>
          <label htmlFor="Gender">Gender</label>
          <select
            id="Gender"
            name="gender"
            value={selectedOption}
            onChange={handleChange}
          >
            <option value="">Not Listed</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label htmlFor="Weight">Weight (lbs)</label>
          <TextField
            type="text"
            id="Weight"
            value={weight}
            onChange={handleWeightChange}
            required
            error={weightError}
            helperText={
              weightError
                ? "Enter between 0 and 1000"
                : ""
            }
          />
          <label htmlFor="Height">Height (in)</label>
          <TextField
            type="text"
            id="Height"
            value={height}
            onChange={handleHeightChange}
            required
            error={heightError}
            helperText={
                heightError
                ? "Enter between 12 and 120"
                : ""
            }
          />
          <label htmlFor="Current-Activity-Level">Current Activity Level</label>
          <input
            type="text"
            id="Current-Activity-Level"
            value={currentActivityLevel}
            onChange={(e) => setCurrentActivityLevel(e.target.value)}
            required
          />
          <label htmlFor="Fitness-Goal">Fitness Goal</label>
          <input
            type="text"
            id="Fitness-Goal"
            value={fitnessGoal}
            onChange={(e) => setFitnessGoal(e.target.value)}
            required
          />
          <label htmlFor="Medical">Medical Conditions/Injuries</label>
          <input
            type="text"
            id="Medical"
            value={medicalConditions}
            onChange={(e) => setMedicalConditions(e.target.value)}
            required
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default Questionaire;
