const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeComplaint(imageUrl, description) {
    const prompt = `
    Analyze this civic complaint image and description: "${description}".
    Provide a JSON response strictly containing these fields:
    1. "issue_type": Categorize as pothole, garbage, waterlogging, drainage, streetlight, road damage, or other.
    2. "severity": Rate as low, medium, high, or critical.
    3. "evidence_confidence": A number between 0 and 100 representing how well the image matches the description.
    4. "verification_required": Boolean. Set to true if the image appears manipulated or does not strongly match the reported issue.
    `;

    try {
        const imageResp = await fetch(imageUrl);
        const arrayBuffer = await imageResp.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = imageResp.headers.get('content-type') || 'image/jpeg';

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash", // Updated to the latest required model
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        { inlineData: { data: base64Image, mimeType: mimeType } }
                    ]
                }
            ],
            config: {
                responseMimeType: "application/json"
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("AI Analysis failed:", error);
        throw error;
    }
}

module.exports = { analyzeComplaint };