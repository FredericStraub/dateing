// netlify/functions/send-message.js
const axios = require('axios');

exports.handler = async function(event, context) {
  // Parse the request body if it's a POST request
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: 'Invalid request body',
    };
  }

  const message = data.message || 'Someone clicked Yes on your website!';

  // Access environment variables for sensitive data
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return {
      statusCode: 500,
      body: 'Server configuration error',
    };
  }

  try {
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await axios.post(telegramApiUrl, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });

    return {
      statusCode: 200,
      body: 'Message sent',
    };
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: 'Error sending message',
    };
  }
};