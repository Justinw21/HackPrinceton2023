require('dotenv').config();
const apiKey = process.env.API_KEY;

const axios = require('axios');

const endpoint = 'https://api.openai.com/v1/engines/davinci/completions';

async function callOpenAI(prompt) {
    try {
        const response = await axios.post(
            endpoint,
            {
                prompt: prompt,
                max_tokens: 50  // Adjust as needed
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );

        console.log('Response from OpenAI:', response.data.choices[0].text.trim());
    } catch (error) {
        console.error('Error calling OpenAI:', error.response ? error.response.data : error.message);
    }
}

// Example prompt
const form = document.getElementById('questionaire-container');
let createPrompt = (event) =>{
    let weight = document.getElementById('Weight').value;
    let height = document.getElementById('Height').value;
    let currentActivityLevel = document.getElementById('Current-Activity-Level').value;
    let fitnessGoal = document.getElementById('Fitness-Goal').value;
    let medical = document.getElementById('Medical').value;
    let prompt = "Create a weekly workout plan based on the following information: \nWeight: "+weight+" pounds\nHeight: "+height+" inches\nCurrent Activity Level: "+currentActivityLevel+"\nFitness Goal: "+fitnessGoal+"\nPre-existing Medical Conditions: "+medical;
    event.preventDefault();
    console.log(prompt);
}

form.addEventListener("Submit", callOpenAI(createPrompt));

// Make the API call
//callOpenAI(examplePrompt);