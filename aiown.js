// Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const chatList = document.getElementById('chat-list');
const searchChatInput = document.getElementById('search-chat');
const newChatBtn = document.getElementById('new-chat-btn');
const narrowNewChatBtn = document.getElementById('narrow-new-chat');
const narrowSearchBtn = document.getElementById('narrow-search');
const narrowModelsBtn = document.getElementById('narrow-models');
const mainChat = document.getElementById('main-chat');

let chats = [
  { id: 1, title: "First Chat" },
  { id: 2, title: "Work Discussion" },
  { id: 3, title: "Casual Talk" },
];

let menuOpenChatId = null;

// Function to render chats filtered by search term
function renderChats(filter = "") {
  chatList.innerHTML = "";

  const filteredChats = chats.filter(c =>
    c.title.toLowerCase().includes(filter.toLowerCase())
  );

  filteredChats.forEach(chat => {
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.dataset.id = chat.id;

    const titleSpan = document.createElement('span');
    titleSpan.textContent = chat.title;

    // 3-dot menu button replaced by invisible (since toggle in sidebar toggle)
    // But we want the 3-dot menu per chat item on hover:
    const menuBtn = document.createElement('button');
    menuBtn.className = 'chat-menu-btn';
    menuBtn.innerHTML = '⋮';
    menuBtn.title = 'Chat options';

    // Menu dropdown container
    const menu = document.createElement('div');
    menu.className = 'chat-menu';

    ['Share', 'Rename', 'Delete'].forEach(action => {
      const btn = document.createElement('button');
      btn.textContent = action;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        handleChatAction(action.toLowerCase(), chat.id);
        closeMenu();
      });
      menu.appendChild(btn);
    });

    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      // Toggle menu visibility
      if (menuOpenChatId === chat.id) {
        closeMenu();
      } else {
        openMenu(chat.id, chatItem, menu);
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', closeMenu);

    chatItem.appendChild(titleSpan);
    chatItem.appendChild(menuBtn);
    chatItem.appendChild(menu);

    chatItem.addEventListener('click', () => {
      alert(`Opening chat "${chat.title}" (id: ${chat.id})`);
    });

    chatList.appendChild(chatItem);
  });
}

function openMenu(chatId, chatItem, menu) {
  closeMenu();
  menuOpenChatId = chatId;
  chatItem.classList.add('menu-open');
}

function closeMenu() {
  if (menuOpenChatId === null) return;
  const openMenuItem = document.querySelector('.chat-item.menu-open');
  if (openMenuItem) openMenuItem.classList.remove('menu-open');
  menuOpenChatId = null;
}

// Chat action handlers
function handleChatAction(action, chatId) {
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;

  if (action === 'share') {
    alert(`Sharing chat: "${chat.title}"`);
  } else if (action === 'rename') {
    const newTitle = prompt('Rename chat:', chat.title);
    if (newTitle && newTitle.trim() !== '') {
      chat.title = newTitle.trim();
      renderChats(searchChatInput.value);
    }
  } else if (action === 'delete') {
    if (confirm(`Are you sure you want to delete "${chat.title}"?`)) {
      chats = chats.filter(c => c.id !== chatId);
      renderChats(searchChatInput.value);
    }
  }
}

// Search chats event
searchChatInput.addEventListener('input', e => {
  renderChats(e.target.value);
});

// New chat button event (expanded)
newChatBtn.addEventListener('click', () => {
  const newTitle = prompt('Enter chat name:');
  if (newTitle && newTitle.trim() !== '') {
    const newId = chats.length ? Math.max(...chats.map(c => c.id)) + 1 : 1;
    chats.push({ id: newId, title: newTitle.trim() });
    renderChats(searchChatInput.value);
  }
});

// Narrow sidebar buttons
document.getElementById('narrow-new-chat').addEventListener('click', () => {
  newChatBtn.click();
});

document.getElementById('narrow-search').addEventListener('click', () => {
  // Open sidebar and focus search
  openSidebar();
  searchChatInput.focus();
});

document.getElementById('narrow-models').addEventListener('click', () => {
  // Open sidebar and focus version select
  openSidebar();
  document.getElementById('version-select').focus();
});

// Sidebar toggle button
sidebarToggle.addEventListener('click', () => {
  if (sidebar.classList.contains('closed')) {
    openSidebar();
  } else {
    closeSidebar();
  }
});

// Functions to open/close sidebar and update main chat margin
// Functions to open/close sidebar
function openSidebar() {
  sidebar.classList.remove('closed');
}

function closeSidebar() {
  sidebar.classList.add('closed');
}
// Initial setup: closed sidebar, adjust main chat margin accordingly
closeSidebar();
renderChats();
