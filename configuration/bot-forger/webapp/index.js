export const openid = {
  authorization_endpoint:
    'https://auth.smarter.codes/realms/hybrid-chat/protocol/openid-connect/auth',
  token_endpoint:
    'https://auth.smarter.codes/realms/hybrid-chat/protocol/openid-connect/token',
  userinfo_endpoint:
    'https://auth.smarter.codes/realms/hybrid-chat/protocol/openid-connect/userinfo',
  scopes_supported: ['openid', 'profile', 'email'],
  client_id: 'bot-forger',
  realm: 'hybrid-chat',
};

export const getTitle = 'Bot Forge Master';
export const getWelcomeMessage =
  "I am a Assistant. I'll assist you with any queries related to bot management";
export const getInputPlaceholder = 'Type Response to Bot Forger Here';
export const sendIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
<path d="M15.1886 2.6486C15.7796 2.49661 16.2951 3.07657 16.0748 3.6457L11.5748 15.2706C11.3817 15.7694 10.7435 15.9115 10.357 15.5418L7.82037 13.1155L6.91857 14.0173C6.44138 14.4946 5.62545 14.1566 5.62545 13.4818V11.016L1.73206 7.29191C1.30702 6.88535 1.49405 6.17004 2.06369 6.02357L15.1886 2.6486ZM13.6024 5.87761L7.60392 10.8328L10.5817 13.681L13.6024 5.87761ZM12.419 4.90956L3.74367 7.14035L6.51252 9.7888L12.419 4.90956Z" fill="white"/>
</svg>
`;
export const themeColor = 'var(--blue-100, #3498db)';
export const Navbar = true;
export const botName = 'Bot Forger';
export const enabled = true;

export const leftPanelHtml = `
<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100%;
  }

  .card {
    width: 300px;
    overflow: hidden;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    background-color: #f1f1f1;
    padding: 10px;
    cursor: pointer;
    user-select: none;
    text-align: center;
    font-weight: bold;
  }

  .card-content {
    flex: 1;
    min-height: 200px;
    max-height: 100vh;
    padding: 10px;
    display: none;
    height: 100%;
    text-align: center;
  }

  .footer {
    padding: 10px;
    text-align: center;
    background-color: #f1f1f1;
  }

  .active {
    display: block;
  }

  .contact-info {
    margin-top: 10px;
  }

  .contact-button {
    margin-top: 20px;
    background-color: #007BFF;
    color: #fff;
    padding: 8px 15px;
    border: none;
    cursor: pointer;
  }

</style>
<div class="container">
  <div class="card">
    <div class="card-header" onclick="window.handleLeftPanel('toggle','card1')">Featured Chatbots</div>
    <div class="card-content active" id="card1-content">
      <!-- Content for Featured Chatbots card goes here -->
    </div>
    <div class="footer">
      <p>Made with <span style="color: red;">❤️</span> using hybrid.chat</p>
    </div>
  </div>

  <div class="card">
    <div class="card-header" onclick="window.handleLeftPanel('toggle','card2')">How it works</div>
    <div class="card-content active" id="card2-content">
      <!-- Content for How it works card goes here -->
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/PBcS1YbAHwY?si=P66m_TGdOLRAaTdj" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  </div>

  <div class="card">
    <div class="card-header" onclick="window.handleLeftPanel('toggle','card3')">Reach out to us</div>
    <div class="card-content active" id="card3-content">
      <!-- Content for Reach out to us card goes here -->
      <div class="contact-info">
        <p>Email: info@example.com</p>
        <p>Website: <a href="https://smarter.codes" target="_blank">https://smarter.codes</a></p>
        <p>WhatsApp: +1 (123) 456-7890</p>
      </div>
      <button class="contact-button" onclick="window.open('https://smarter.codes', '_blank')">Contact Us</button>
    </div>
  </div>
</div>
`;

export const handleLeftPanel = (f, d) => {
  if (f === 'toggle') {
    const cardId = d;
    const content = document.getElementById(cardId + '-content');
    content.classList.toggle('active');
  }
};

export const headerPaneHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>
    Bot Forge Master
  </title>
  <style>
    .header-button {
      padding: 8px 16px;
      margin-right: 10px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 20px;
    }

    .edit-prompt-button {
      background-color: lightgrey;
      display: none;
    }

    .publish-button {
      background-color: #3498db; 
      color: #fff;
      display: none;
    }

    .logout-button {
      background-color: lightcoral; 
      color: #000;
      display: none;
    }

    .active {
      display: initial;
    }
    
  </style>
</head>
<body>
  <span>Bot Forge Master</span>
  <div>
    <button id="prompt-btn" class="header-button edit-prompt-button">Edit Prompt</button>
    <button id="publish-btn" class="header-button publish-button">Publish</button>
    <button id="logout-btn" class="header-button logout-button" onclick="window.handleHeaderPane('logout')">Logout</button>
  </div>
</body>
</html>
`;

export const handleHeaderPane = (f) => {
  if (f === 'logout') {
    localStorage.removeItem('access_token');
    window.location.reload();
  }

  if (f === 'login') {
    setTimeout(() => {
      const logout = document.getElementById('logout-btn');
      logout && logout.classList.add('active');
      const prompt = document.getElementById('prompt-btn');
      prompt && prompt.classList.add('active');
      const publish = document.getElementById('publish-btn');
      publish && publish.classList.add('active');
    }, 5000);
  }
};

export const leftPanelStateUpdate = (stepIndex) => {
  stepIndex = stepIndex - 1;
  const steps = document.querySelectorAll('.step');
  steps.forEach((step, index) => {
    step.classList.remove('completed', 'active', 'upcoming');
    if (index < stepIndex) {
      step.classList.add('completed');
    } else if (index === stepIndex) {
      step.classList.add('active');
    } else {
      step.classList.add('upcoming');
    }
  });
};

export const showUserEnteredPasssword = false;
export const finalMessage = 'Thanks for the provided information';
export const conversational = true;
