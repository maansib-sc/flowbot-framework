export const openid = {
  authorization_endpoint: '',
  token_endpoint: '',
  userinfo_endpoint: '',
  scopes_supported: ['openid', 'profile', 'email'],
  client_id: '',
  realm: '',
};

export const getTitle = 'Bot Forge Master';
export const getWelcomeMessage =
  "I am a Assistant. I'll assist you with any queries";
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
    </style>
    <div>
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
    <style>
    </style>
    <div>
    </div>
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
