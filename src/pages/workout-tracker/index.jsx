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
import Select from "@mui/material/Select";
import Button from '@mui/material/Button';
import "./style.css";

const Questionaire = () => {
  const navigate = useNavigate();
  //variables for the categories and their error messages
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [medicalInjury, setMedicalInjury] = useState("");
  const [genderError, setGenderError] = useState(false);
  const [weightError, setWeightError] = useState(false);
  const [heightError, setHeightError] = useState(false);
  const [activityLevelError, setWorkoutFreqError] = useState(false);
  const [goalError, setGoalError] = useState(false);
  const [medInjuryError, setMedInjuryError] = useState(false);

  //output
  const [result, setResult] = useState("");

  //output
  const { name, profilePhoto } = useGetUserInfo();

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

    setActivityLevel(inputValueWF);

  };

  const handleGenderChange = (event) => {
    const inputValueG = event.target.value;

    setGender(inputValueG);

  };

  const handleFitnessGoalChange = (event) => {
    const inputValueGoal = event.target.value;

    setFitnessGoal(inputValueGoal);

  };

  const handleMedicalInjuriesChange = (event) => {
    const inputValueMed = event.target.value;
    setMedicalInjury(inputValueMed);

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
  
    // Check if all required fields have valid inputs
    const isGenderValid = gender !== "";
    const isWeightValid = /^\d+$/.test(weight) && weight >= 0 && weight <= 1000;
    const isHeightValid = /^\d+$/.test(height) && height >= 12 && height <= 120;
    const isActivityLevelValid = activityLevel !== "";
    const isFitnessGoalValid = fitnessGoal !== "";
    const isMedicalInjuryValid = medicalInjury !== "";
  
    // Update error states
    setGenderError(!isGenderValid);
    setWeightError(!isWeightValid);
    setHeightError(!isHeightValid);
    setWorkoutFreqError(!isActivityLevelValid);
    setGoalError(!isFitnessGoalValid);
    setMedInjuryError(!isMedicalInjuryValid);
  
    // If all fields are valid, make the API call
    if (
      isGenderValid &&
      isWeightValid &&
      isHeightValid &&
      isActivityLevelValid &&
      isFitnessGoalValid &&
      isMedicalInjuryValid
    ) {
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
        medicalInjury +
        "\nSeparate the exercises by the character '-', no numbers"
      console.log(prompt);
  
      // Make the API call
      callOpenAI(prompt);
    }
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
      parseResult(exercises);
    } catch (error) {
      console.error(
        "Error calling OpenAI:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const parseResult = async (result) => {
    /*let series = result.split("Monday");
    result.split("Tuesday");
    result.split("Wednesday");
    result.split("Thursday");
    result.split("Friday");
    result.split("Saturday");
    result.split("Sunday");
    result.split(" - ");*/
    let selected_div = document.querySelector('.results');

    let series = result.split("\n\n");
    for(let i = 0; i<series.length; i++){
      series[i]=series[i].split("- ");
    }
    //now series should contain the days and workouts
    var days = document.createElement('ul');
    days.classList.add('workout-list');
    days.style.display = 'flex'; // Set display property to 'flex'
    days.style.flexDirection= 'column'; // Allow items to wrap to the next line
    selected_div.appendChild(days);
    
    for(let j = 0; j < series.length; j++){
      var each_day= document.createElement('li');
      each_day.textContent= series[j][0];
      selected_div.appendChild(each_day);
      for(let k = 1; k < series[j].length; k++){
        console.log(series[j][k]);
        var label = document.createElement('label');
        label.textContent = series[j][k] + "\n";
        var each_exercise = document.createElement('input');
        each_exercise.type = 'checkbox';
        selected_div.appendChild(each_exercise);
        selected_div.appendChild(label);
        selected_div.appendChild(document.createElement('br'));
      }
      
    }
  };

  return (
    <>
      <div className="questionaire-page">
        <div className="profile">
          <img className="profile-photo" src={profilePhoto} alt="Profile" />
          <p>{name}</p>
          <Button variant="contained" onClick={signUserOut}>
          Sign Out
</Button>
        </div>

        <form className="questionaire-container" onSubmit={createPrompt}>
          <InputLabel id="Gender">Gender</InputLabel>
          <FormControl sx={{ m: 0, minWidth: 215 }} size="small" error>
            <Select
              id="gender"
              value={gender}
              onChange={handleGenderChange}
              required
              error={genderError}
              helperText={genderError ? "This is a required question" : ""}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <InputLabel id="Weight">Weight (lbs)</InputLabel>
          <TextField
            type="text"
            id="weight"
            value={weight}
            onChange={handleWeightChange}
            required
            error={weightError}
            helperText={weightError ? "Enter between 0 and 1000" : ""}
          />

          <InputLabel id="Height">Height (in)</InputLabel>

          <TextField
            type="text"
            id="height"
            value={height}
            onChange={handleHeightChange}
            required
            error={heightError}
            helperText={heightError ? "Enter between 12 and 120" : ""}
          />
          <InputLabel id="Exercise-Freq">Activity Level</InputLabel>
          <FormControl sx={{ m: 0, minWidth: 215 }} size="small" error>
            <Select
              id="exercise-freq"
              value={activityLevel}
              onChange={handleActivityLevelChange}
              required
              error={activityLevelError}
              helperText={
                activityLevelError ? "This is a required question" : ""
              }
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

          <InputLabel id="Fitness-Goal">Fitness Goal</InputLabel>
          <TextField
            sx={{ m: 0, minWidth: 400 }}
            id="fitness-goal"
            multiline
            maxRows={4}
            onChange={handleFitnessGoalChange}
            required
            error={goalError}
          />
          <InputLabel id="Medical">Medical Conditions/Injuries</InputLabel>
          <TextField
            sx={{ m: 0, minWidth: 400 }}
            id="medical"
            multiline
            maxRows={4}
            onChange={handleMedicalInjuriesChange}
            required
            error={medInjuryError}
          />
          <Button type="submit"  variant="contained" >
  Submit
</Button>
        </form>
      </div>
      <div className="results">
        <h3>Result:</h3>
      </div>
    </>
  );
};

export default Questionaire;
