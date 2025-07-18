import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';
const HEADERS = {
  'Content-Type': 'application/json',
  'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
};

export const runCode = async (req, res) => {
  try {
    const { languageId, sourceCode, stdin = '' } = req.body;

    const response = await axios.post(
      `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
      {
        language_id: languageId,
        source_code: sourceCode,
        stdin: '',
      },
      { headers: HEADERS }
    );

    return res.json({ result: response.data });
  } catch (error) {
    console.error('Judge0 Error:', error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
};
