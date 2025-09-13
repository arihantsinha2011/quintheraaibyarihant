let chats = [
  { id: 1, title: "First Chat" },
  { id: 2, title: "Work Discussion" },
  { id: 3, title: "Casual Talk" }
];

function renderChats(filter = "") {
  const chatList = document.getElementById("chat-list");
  chatList.innerHTML = "";
  const filtered = chats.filter(chat =>
    chat.title.toLowerCase().includes(filter.toLowerCase())
  );
  filtered.forEach(chat => {
    const item = document.createElement("div");
    item.className = "chat-item";
    item.dataset.id = chat.id;
    item.innerHTML = `<span>${chat.title}</span>`;
    chatList.appendChild(item);
  });
}

renderChats();

function addMessage(text, type) {
  const chatContainer = document.getElementById("chat-container");
  const msg = document.createElement("div");
  msg.classList.add("message", type === "user" ? "user-message" : "bot-message");
  msg.textContent = text;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function getAIResponse(userMessage) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("API Error:", text);
      return "Error: Unable to get response from AI.";
    }

    const data = await response.json();
    return data.choices[0].message.content || "No response received.";
  } catch (error) {
    console.error("Fetch Error:", error);
    return "Error: Unable to get response from AI.";
  }
}

const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");

sendBtn.addEventListener("click", async () => {
  const msg = userInput.value.trim();
  if (!msg) return;
  addMessage(msg, "user");
  userInput.value = "";
  const reply = await getAIResponse(msg);
  addMessage(reply, "bot");
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
