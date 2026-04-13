import axios from "axios";

export const verifyTurnstile = async (token, ip) => {
  try {
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      null,
      {
        params: {
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: ip,
        },
      }
    );

    return response.data.success;

  } catch (error) {
    console.error("❌ Error verificando Turnstile:", error.message);
    return false;
  }
};