// server/controllers/devbuddyController.js
import axios from 'axios';
import 'dotenv/config';

export const askGPT = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Enhanced validation
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ 
        error: 'Prompt is required and cannot be empty.',
        success: false 
      });
    }

    // Validate API key exists
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set in environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error.',
        success: false 
      });
    }

    // Make API request with timeout
    const { data } = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are DevBuddy, an expert AI assistant for programming and data‑structures & algorithms (DSA).

When you respond to any coding or DSA question:
1. Give a clear, step‑by‑step explanation.
2. Include both time complexity and space complexity in Big‑O notation.
3. Provide code examples when helpful.
4. Format your response clearly with proper sections.

If the user asks anything else, reply: "Sorry, I can only help with programming and DSA questions."`.trim()
          },
          { 
            role: 'user', 
            content: prompt.trim() 
          }
        ],
        max_tokens: 2000, // Prevent overly long responses
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
          'X-Title': 'DevBuddy AI Assistant'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    // Validate response structure
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure from OpenRouter API:', data);
      return res.status(500).json({ 
        error: 'Invalid response from AI service.',
        success: false 
      });
    }

    const result = data.choices[0].message.content;
    
    if (!result || result.trim() === '') {
      return res.status(500).json({ 
        error: 'Empty response from AI service.',
        success: false 
      });
    }

    return res.json({ 
      result: result.trim(),
      success: true 
    });

  } catch (err) {
    console.error('DevBuddy API Error:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      url: err.config?.url
    });

    // Handle specific error types
    if (err.code === 'ECONNABORTED') {
      return res.status(408).json({ 
        error: 'Request timeout. Please try again.',
        success: false 
      });
    }

    if (err.response?.status === 401) {
      return res.status(500).json({ 
        error: 'API authentication failed. Please check server configuration.',
        success: false 
      });
    }

    if (err.response?.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.',
        success: false 
      });
    }

    if (err.response?.status >= 500) {
      return res.status(502).json({ 
        error: 'AI service is temporarily unavailable. Please try again later.',
        success: false 
      });
    }

    

    return res.status(500).json({ 
      error: 'Failed to generate response. Please try again.',
      success: false 
    });
  }
};
