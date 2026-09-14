const state = {
  userId: null,
  email: '',
  name: 'User',
  displayName: '',
  role: 'user',
  bills: [],
  appliances: [],
  memberSince: null,
  page: 'dashboard'
};

window.RUSHXARENA_STATE = state;

function toast(message) {
  const target = document.getElementById('toast');
  if (!target) return;
  target.textContent = message;
  target.classList.add('show');
  setTimeout(() => target.classList.remove('show'), 2400);
}

function initialize() {
  const authScreen = document.getElementById('authScreen');
  const appScreen = document.getElementById('appScreen');
  if (authScreen) authScreen.classList.remove('hidden');
  if (appScreen) appScreen.classList.add('hidden');
  state.bills = [];
  state.appliances = [];
  toast('No electricity data is available until the user uploads or enters real information.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
