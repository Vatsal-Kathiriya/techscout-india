const contactForm = document.querySelector("#contactForm");
const contactStatus = document.querySelector("#contactStatus");
const apiBaseUrl = (window.GENZTECHCO_CONFIG?.apiBaseUrl || "").replace(/\/$/, "");

contactForm.addEventListener("submit", async event => {
  event.preventDefault();
  const submitButton = contactForm.querySelector("button");
  submitButton.disabled = true;
  contactStatus.textContent = "";

  if (!apiBaseUrl) {
    contactStatus.textContent = "The contact API is not connected yet. Please email hello@genztechco.in directly.";
    submitButton.disabled = false;
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Unable to send message.");
    contactForm.reset();
    contactStatus.textContent = "Thanks — your message has been sent.";
  } catch (error) {
    console.warn("Contact form submission failed.", error);
    contactStatus.textContent = "We could not send that right now. Please email hello@genztechco.in.";
  } finally {
    submitButton.disabled = false;
  }
});
