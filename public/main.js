const chatEl = document.getElementById("chat");
const composer = document.getElementById("composer");
const messageInput = document.getElementById("message");
const statusEl = document.getElementById("status");
const sendButton = document.getElementById("send");
const modelPill = document.getElementById("model-pill");

const messages = [];

const renderMessage = ({ role, content }) => {
  const wrapper = document.createElement("div");
  wrapper.className = `message message--${role}`;

  const roleEl = document.createElement("div");
  roleEl.className = "message__role";
  roleEl.textContent = role === "user" ? "You" : "Claude";

  const contentEl = document.createElement("div");
  contentEl.className = "message__content";
  contentEl.textContent = content;

  wrapper.append(roleEl, contentEl);
  chatEl.append(wrapper);
  chatEl.scrollTop = chatEl.scrollHeight;
};

const setStatus = (text) => {
  statusEl.textContent = text;
};

const setSending = (isSending) => {
  sendButton.disabled = isSending;
  messageInput.disabled = isSending;
};

const sendMessage = async (content) => {
  messages.push({ role: "user", content });
  renderMessage({ role: "user", content });

  setSending(true);
  setStatus("Claude is thinking...");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Something went wrong.");
    }

    const data = await response.json();
    const reply = data.text?.trim() || "(No response text returned.)";
    messages.push({ role: "assistant", content: reply });
    renderMessage({ role: "assistant", content: reply });
    setStatus("");
  } catch (error) {
    setStatus(error.message);
  } finally {
    setSending(false);
  }
};

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const content = messageInput.value.trim();
  if (!content) {
    return;
  }
  messageInput.value = "";
  sendMessage(content);
});

const init = async () => {
  try {
    const response = await fetch("/api/config");
    const data = await response.json();
    modelPill.textContent = `Model: ${data.model || "claude-3-5-sonnet-20240620"}`;
  } catch (error) {
    modelPill.textContent = "Model: claude-3-5-sonnet-20240620";
  }

  renderMessage({
    role: "assistant",
    content: "Hi! Set your ANTHROPIC_API_KEY and start chatting."
  });
};

init();
