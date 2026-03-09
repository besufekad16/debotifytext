/**
 * Direct API Test Script
 * Tests the Gemini API directly to verify it's working
 * Run this BEFORE deploying to confirm the fix works
 * 
 * Usage: node test-api-directly.js
 */

const GEMINI_API_KEY = process.env.AISTUDIOS_API_KEY || "AIzaSyAt5-Xh4lxI-MKorSuazzhi9-paGcu3o9s";
const MODEL = "gemini-3-flash-preview"; // Testing premium model

async function testGeminiAPI() {
  console.log("🧪 Testing Gemini API Configuration...\n");
  console.log(`Model: ${MODEL}`);
  console.log(`API Key: ${GEMINI_API_KEY.substring(0, 10)}...${GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 5)}\n`);

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  // Test with a humanization-like prompt
  const testPrompt = `Rewrite this text in simple words: "The implementation of artificial intelligence has revolutionized modern technology."`;

  const requestBody = {
    contents: [{
      parts: [{ text: testPrompt }]
    }],
    generationConfig: {
      temperature: 1.0,
      maxOutputTokens: 200,
    }
  };

  try {
    console.log("📡 Sending test request to Gemini API...");
    console.log("⏱️  This may take a few seconds...\n");
    
    const startTime = Date.now();
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const endTime = Date.now();

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response time: ${endTime - startTime}ms\n`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("❌ ERROR Response:");
      console.error(errorBody);
      console.error("\n🔧 Possible issues:");
      console.error("  1. Invalid API key");
      console.error("  2. Model name is incorrect");
      console.error("  3. API key doesn't have access to this model");
      console.error("  4. Billing not enabled on Google Cloud project");
      console.error("  5. Rate limit exceeded (free tier: 15 requests/minute)");
      
      // Try to parse error for more details
      try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson.error) {
          console.error("\n📋 Error details:");
          console.error(`  Code: ${errorJson.error.code}`);
          console.error(`  Message: ${errorJson.error.message}`);
          console.error(`  Status: ${errorJson.error.status}`);
        }
      } catch (e) {
        // Ignore parse errors
      }
      
      return false;
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (generatedText) {
      console.log("✅ SUCCESS! API is working correctly.\n");
      console.log("📝 Generated text:");
      console.log("─".repeat(60));
      console.log(generatedText);
      console.log("─".repeat(60));
      console.log("\n✨ Your Gemini configuration is CORRECT!");
      console.log("🚀 You can now deploy to Vercel with confidence.");
      console.log("\n📋 Next steps:");
      console.log("  1. git add .");
      console.log("  2. git commit -m 'fix: use verified Gemini model'");
      console.log("  3. git push origin main");
      console.log("  4. Wait for Vercel deployment");
      console.log("  5. Test on production");
      return true;
    } else {
      console.log("⚠️  WARNING: Response received but no text generated");
      console.log("Full response:", JSON.stringify(data, null, 2));
      return false;
    }

  } catch (error) {
    console.error("❌ ERROR:", error.message);
    console.error("\n🔧 Possible issues:");
    console.error("  1. Network connectivity problem");
    console.error("  2. Invalid API endpoint");
    console.error("  3. Firewall blocking the request");
    console.error("  4. DNS resolution failure");
    return false;
  }
}

// Test streaming as well
async function testGeminiStreaming() {
  console.log("\n" + "=".repeat(60));
  console.log("🌊 Testing Streaming API...\n");

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?key=${GEMINI_API_KEY}`;

  const testPrompt = `Rewrite: "AI is cool."`;

  const requestBody = {
    contents: [{
      parts: [{ text: testPrompt }]
    }],
    generationConfig: {
      temperature: 1.0,
      maxOutputTokens: 100,
    }
  };

  try {
    console.log("📡 Sending streaming request...");
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("❌ Streaming failed:", errorBody);
      return false;
    }

    if (!response.body) {
      console.error("❌ No response body");
      return false;
    }

    console.log("✅ Streaming started successfully");
    console.log("📝 Receiving chunks...\n");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let chunkCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      chunkCount++;

      // Try to parse JSON chunks
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.trim() && line.trim() !== ',') {
          try {
            const json = JSON.parse(line.trim().replace(/,$/, ''));
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              fullText += text;
              process.stdout.write(text);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    console.log("\n\n✅ Streaming completed successfully!");
    console.log(`📊 Received ${chunkCount} chunks`);
    console.log(`📝 Total text length: ${fullText.length} characters`);
    return true;

  } catch (error) {
    console.error("❌ Streaming error:", error.message);
    return false;
  }
}

// Run both tests
(async () => {
  console.log("╔" + "═".repeat(58) + "╗");
  console.log("║" + " ".repeat(10) + "GEMINI API VERIFICATION TEST" + " ".repeat(20) + "║");
  console.log("╚" + "═".repeat(58) + "╝\n");

  const basicTest = await testGeminiAPI();
  
  if (basicTest) {
    const streamTest = await testGeminiStreaming();
    
    if (streamTest) {
      console.log("\n" + "=".repeat(60));
      console.log("🎉 ALL TESTS PASSED!");
      console.log("=".repeat(60));
      console.log("\n✅ Your configuration is 100% working");
      console.log("✅ Both basic and streaming APIs work");
      console.log("✅ Ready for production deployment");
    }
  } else {
    console.log("\n" + "=".repeat(60));
    console.log("❌ TESTS FAILED");
    console.log("=".repeat(60));
    console.log("\n⚠️  Fix the issues above before deploying");
  }
})().catch(console.error);
