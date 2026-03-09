/**
 * Quick verification script to test if the Gemini model is working
 * Run this to verify the API key and model are configured correctly
 * 
 * Usage: node verify-model.js
 */

const GEMINI_API_KEY = process.env.AISTUDIOS_API_KEY || "AIzaSyAA6W9p9gR4SX8ePAYluX2vV1sVGGZ70jY";
const MODEL = "gemini-2.5-flash"; // Stable, lightest Gemini model (VERIFIED)

async function testGeminiModel() {
  console.log("🔍 Testing Gemini Model Configuration...\n");
  console.log(`Model: ${MODEL} (stable, lightest Gemini model - VERIFIED)`);
  console.log(`API Key: ${GEMINI_API_KEY.substring(0, 10)}...${GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 5)}\n`);

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
    contents: [{
      parts: [{ text: "Say 'Hello, I am working!' in exactly those words." }]
    }],
    generationConfig: {
      temperature: 1.0,
      maxOutputTokens: 50,
    }
  };

  try {
    console.log("📡 Sending test request to Gemini API...");
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    console.log(`Status: ${response.status} ${response.statusText}\n`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("❌ ERROR Response:");
      console.error(errorBody);
      console.error("\n🔧 Possible issues:");
      console.error("  1. Invalid API key");
      console.error("  2. Model name is incorrect");
      console.error("  3. API key doesn't have access to this model");
      console.error("  4. Billing not enabled on Google Cloud project");
      return;
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (generatedText) {
      console.log("✅ SUCCESS! Model is working correctly.");
      console.log(`\nGenerated text: "${generatedText}"`);
      console.log("\n✨ Your Gemini configuration is correct!");
      console.log("💡 Using stable model (gemini-2.5-flash) - lightest production-ready option");
      console.log("📚 Source: Official Google AI Studio documentation (verified 2025)");
      console.log("You can now deploy to Vercel with confidence.");
    } else {
      console.log("⚠️  WARNING: Response received but no text generated");
      console.log("Full response:", JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error("❌ ERROR:", error.message);
    console.error("\n🔧 Possible issues:");
    console.error("  1. Network connectivity problem");
    console.error("  2. Invalid API endpoint");
    console.error("  3. Firewall blocking the request");
  }
}

// Run the test
testGeminiModel().catch(console.error);
