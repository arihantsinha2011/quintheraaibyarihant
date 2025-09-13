// --------- CHAT DATA ---------
let chats = [
  { id: 1, title: "First Chat" },
  { id: 2, title: "Work Discussion" },
  { id: 3, title: "Casual Talk" },
];
let menuOpenChatId = null;

// --------- RENDER CHATS ---------
function renderChats(filter="") {
  const chatList = document.getElementById('chat-list');
  chatList.innerHTML = "";
  const filtered = chats.filter(c=>c.title.toLowerCase().includes(filter.toLowerCase()));
  filtered.forEach(chat=>{
    const item = document.createElement('div');
    item.className="chat-item";
    item.dataset.id=chat.id;
    item.innerHTML=`<span>${chat.title}</span><button class="chat-menu-btn">⋮</button>`;
    chatList.appendChild(item);
  });
}

renderChats();

// --------- CHAT FUNCTIONS ---------
function addMessage(text,type){
  const chatContainer=document.getElementById('chat-container');
  const msg=document.createElement('div');
  msg.classList.add('message',type==='user'?'user-message':'bot-message');
  msg.textContent=text;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// --------- OPENROUTER API ---------
async function getAIResponse(userMessage){
  try{
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions',{
      method:'POST',
      headers:{
        'Authorization':'Bearer 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',
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        model:'deepseek/deepseek-chat-v3.1',
        messages:[{role:'user',content:userMessage}]
      })
    });
    if(!res.ok){
      const txt = await res.text();
      console.error('API Error:',txt);
      return 'Error: Unable to get response from AI.';
    }
    const data = await res.json();
    return data.choices[0].message.content || 'No response received.';
  }catch(e){
    console.error('Fetch Error:',e);
    return 'Error: Unable to get response from AI.';
  }
}

// --------- SEND MESSAGE ---------
const sendBtn=document.getElementById('send-btn');
const userInput=document.getElementById('user-input');
sendBtn.addEventListener('click',async ()=>{
  const msg=userInput.value.trim();
  if(!msg) return;
  addMessage(msg,'user');
  userInput.value='';
  const reply=await getAIResponse(msg);
  addMessage(reply,'bot');
});
userInput.addEventListener('keydown',e=>{ if(e.key==='Enter') sendBtn.click(); });
