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
const examplePrompt = 'Once upon a time, in a land far, far away...';

// Make the API call
callOpenAI(examplePrompt);