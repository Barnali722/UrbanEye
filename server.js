const express = require('express');
const cors = require('cors');
const snowflake = require('snowflake-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Snowflake Connection with proper context
const snowflakeConnection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USER,
  password: process.env.SNOWFLAKE_PASSWORD,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE
});

snowflakeConnection.connect((err, conn) => {
  if (err) {
    console.error('❌ Unable to connect to Snowflake:', err.message);
  } else {
    console.log('✅ Successfully connected to Snowflake as id: ' + conn.getId());
  }
});

// Helper function to allow async/await with Snowflake queries
const executeQuery = (sqlText, binds = []) => {
  return new Promise((resolve, reject) => {
    snowflakeConnection.execute({
      sqlText,
      binds,
      complete: (err, stmt, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    });
  });
};

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/complaints', async (req, res) => {
  try {
    const { citizen_id, description, image_url, lat, lng } = req.body;

    console.log(`Analyzing new complaint: "${description}"`);

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const prompt = `
      Analyze this civic issue description: "${description}".
      Return ONLY a JSON object with exact keys:
      - "issue_type": string (e.g., pothole, streetlight)
      - "severity": string ("high", "medium", or "low")
      - "verification_required": boolean
    `;

    const result = await model.generateContent(prompt);
    let aiText = result.response.text();
    
    aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiData = JSON.parse(aiText);
    
    console.log("AI Categorization successful:", aiData);

    const insertQuery = `
      INSERT INTO COMPLAINTS 
      (CITIZEN_ID, DESCRIPTION, IMAGE_URL, LAT, LNG, ISSUE_TYPE, SEVERITY, VERIFICATION_REQUIRED) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const binds = [
      citizen_id || 'anonymous', 
      description, 
      image_url || 'no_image', 
      lat || 0.0, 
      lng || 0.0, 
      aiData.issue_type, 
      aiData.severity, 
      aiData.verification_required
    ];

    await executeQuery(insertQuery, binds);
    console.log("Data successfully saved to Snowflake.");

    res.status(200).json({
      success: true,
      ai_data: aiData,
      message: "Report analyzed by AI and securely saved to Snowflake."
    });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: 'Failed to process report' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});