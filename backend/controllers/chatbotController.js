// backend/controllers/chatbotController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize the Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const callGenerativeAI = async (message) => {
  try {
    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are a chatbot for a boutique. Answer user queries in simple and clear sentences, limited to 2–3 lines. 
      Message: ${message}.
    `;

    // Generate content based on the user input
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  } catch (error) {
    console.error("Error calling Generative AI:", error);
    throw error; // Rethrow the error to handle it in the route
  }
};

const chatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;

    // Call Gemini API
    const botReply = await callGenerativeAI(message);
    console.log(botReply);

    // Send the response back to the client
    res.json({ response: botReply });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ error: "Failed to get response from chatbot" });
  }
};

const generateImage = async (req, res) => {
  try {
    const { description } = req.body;

    // Placeholder: Gemini does not natively support image generation
    res.status(501).json({
      error: "Image generation is not supported by Gemini at this time.",
    });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
};

module.exports = { chatbotResponse, generateImage };