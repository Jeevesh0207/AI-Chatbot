const express = require('express');
const axios = require('axios');
require('dotenv').config();
const { Groq } = require("groq-sdk");
const cors = require("cors")

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors({
    origin:"*",
    credentials:true
}))

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


// Endpoint to chat with Groq AI
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log(userMessage)

    try {
        const completion = await groq.chat.completions
            .create({
                messages: [
                    {
                        role: "user",
                        content: userMessage,
                    },
                ],
                model: "llama3-8b-8192",
            })

        const botResponse = completion.choices[0].message.content;
        res.json({ ok:true, message: botResponse });
    } catch (error) {
        console.error('Error with Groq API:', error);
        res.status(500).json({ ok:false, message: 'Error processing your request' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
