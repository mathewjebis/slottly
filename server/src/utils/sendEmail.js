const sendEmail = async ({ to, subject, html }) => {
  const apiKey = (process.env.BREVO_API_KEY || "").trim();
  const senderEmail = (process.env.GMAIL_USER || "").trim();

  // In development or when using mock configuration, log to console for easy testing
  if (
    process.env.NODE_ENV !== "production" ||
    !apiKey ||
    apiKey.startsWith("mock") ||
    !senderEmail ||
    senderEmail.includes("example.com")
  ) {
    console.log("================ [DEV EMAIL SIMULATION] ================");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("========================================================");
    return;
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "Slottly", email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to send email via Brevo");
  }
};

module.exports = sendEmail;
