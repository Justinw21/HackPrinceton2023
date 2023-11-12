import React, { useState } from "react";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { signOut } from "firebase/auth";
import axios from "axios";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import "./style.css";

const Questionaire = () => {
  const navigate = useNavigate();
  //variables for the categories and their error messages
  const [selectedOption, setSelectedOption] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [weightError, setWeightError] = useState(false);
  const [heightError, setHeightError] = useState(false);
  const [activityLevelError, setWorkoutFreqError] = useState(false);

  //output
  const [result, setResult] = useState("");

  const { name, profilePhoto } = useGetUserInfo();

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleWeightChange = (event) => {
    const inputValueW = event.target.value;
    const isValidInputW =
      /^\d+$/.test(inputValueW) && inputValueW >= 0 && inputValueW <= 1000;
    setWeight(inputValueW);
    setWeightError(!isValidInputW);
  };

  const handleHeightChange = (event) => {
    const inputValueH = event.target.value;
    const isValidInputH =
      /^\d+$/.test(inputValueH) && inputValueH >= 12 && inputValueH <= 120;
    setHeight(inputValueH);
    setHeightError(!isValidInputH);
  };

  const handleActivityLevelChange = (event) => {
    const inputValueWF = event.target.value;
    const isValidInputWF = /^\d+$/.test(inputValueWF) && inputValueWF !== ""; // Check if the input is a non-empty string of digits
    setActivityLevel(inputValueWF);
    setWorkoutFreqError(!isValidInputWF);
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
      "Create a weekly exercise plan based on the following information: \nWeight: " +
      weight +
      " pounds\nHeight: " +
      height +
      " inches\nCurrent Activity Level: " +
      activityLevel +
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
          model: "gpt-3.5-turbo",

          messages: [
            {
              role: "system",
              content: "You are a personal trainer.",
            },
            {
              role: "user",
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

      const exercises = response.data.choices[0].message.content;
      console.log("Exercises:", exercises);
      setResult(exercises);
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
          <img className="profile-photo" src={profilePhoto} alt="Profile" />
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
          <InputLabel id="Weight">Weight (lbs)</InputLabel>
          <TextField
            type="text"
            id="Weight"
            value={weight}
            onChange={handleWeightChange}
            required
            error={weightError}
            helperText={weightError ? "Enter between 0 and 1000" : ""}
          />

          <InputLabel id="Height">Height (in)</InputLabel>

          <TextField
            type="text"
            id="Height"
            value={height}
            onChange={handleHeightChange}
            required
            error={heightError}
            helperText={heightError ? "Enter between 12 and 120" : ""}
          />
          <InputLabel id="Exercise-Freq">Activity Level</InputLabel>
          <FormControl sx={{ m: 0, minWidth: 215 }} size="small" error>
            <Select
              id="demo-simple-select-error"
              value={activityLevel}
              onChange={handleActivityLevelChange}
              required
              error={activityLevelError}
              helperText={weightError ? "Enter between 0 and 1000" : ""}
            >
              <MenuItem value="Sedentary: little or no exercise">
                Sedentary: little or no exercise
              </MenuItem>
              <MenuItem value="Light: exercise 1-3 times/week">
                Light: exercise 1-3 times/week
              </MenuItem>
              <MenuItem value="Moderate: exercise 4-5 times week">
                Moderate: exercise 4-5 times week
              </MenuItem>
              <MenuItem value="Active: daily exercise or intense exercise 3-4 times/week">
                Active: daily exercise or intense exercise 3-4 times/week
              </MenuItem>
              <MenuItem value="Very Active: intense exercise 6-7 times/week">
                Very Active: intense exercise 6-7 times/week
              </MenuItem>
              <MenuItem value="Extra Active: very intense exercise daily, or physical job">
                Extra Active: very intense exercise daily, or physical job
              </MenuItem>
            </Select>
          </FormControl>

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
      <div>

        <h3>Result:</h3>
        <p>{result}</p>
      </div>
    </>
  );
};

export default Questionaire;
