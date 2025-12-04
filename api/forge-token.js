import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// ⚠ Route must be "/" inside the function
app.get("/", async (req, res) => {
  const base64Auth = process.env.FORGE_BASE64;

  if (!base64Auth) {
    return res.status(500).json({ error: "FORGE_BASE64 environment variable missing" });
  }

  try {
    const response = await axios.post(
      "https://developer.api.autodesk.com/authentication/v2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        scope: "data:write data:read bucket:create bucket:delete"
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64Auth}`
        }
      }
    );

    res.json({
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
      token_type: response.data.token_type
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to retrieve Forge token" });
  }
});

export default app;
