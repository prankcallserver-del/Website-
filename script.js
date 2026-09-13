/* ============================================================
   SecurePay — Binance Deposit Portal
   All logic is SIMULATED. No real server / API is used.
   ============================================================ */

/* ============ LOGIN CREDENTIALS ============ */
const VALID_USERNAME = 'prankuser568';
const VALID_PASSWORD = 'prankcallapi 568';

/* ============ SIMULATED USER DATA ============ */
const user = {
  name: 'Prank User',
  id: '84920175',
  balance: 0.00
};

let selected = null;

/* ============ DOM ============ */
const loginScreen = document.getElementById('loginScreen');
const appScreen   = document.getElementById('appScreen');
const loginForm   = document.getElementById('loginForm');
const loginUser   = document.getElementById('loginUser');
const loginPass   = document.getElementById('loginPass');
const loginStatus = document.getElementById('loginStatus');
const eyeBtn      = document.getElementById('eyeBtn');
const logoutBtn   = document.getElementById('logoutBtn');

const btns           = document.querySelectorAll('.amount-btn');
const confirmBtn     = document.getElementById('confirmBtn');
const status         = document.getElementById('status');
const step1          = document.getElementById('step1');
const step2          = document.getElementById('step2');
const errorBox       = document.getElementById('errorBox');
const balanceValue   = document.getElementById('balanceValue');
const copyBtn        = document.getElementById('copyBtn');
const copyText       = document.getElementById('copyText');
const submitProofBtn = document.getElementById('submitProofBtn');
const retryBtn       = document.getElementById('retryBtn');

/* ============================================================
   LOGIN HANDLER
   ============================================================ */
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const u = loginUser.value.trim();
  const p = loginPass.value;

  loginStatus.className = 'status pending';
  loginStatus.textContent = '⏳ Authenticating...';

  setTimeout(() => {
    if (u === VALID_USERNAME && p === VALID_PASSWORD) {
      loginStatus.className = 'status success';
      loginStatus.textContent = '✓ Login successful. Redirecting...';

      setTimeout(() => {
        loginScreen.classList.add('hide');
        appScreen.style.display = 'block';
        initProfile();
      }, 800);

    } else {
      loginStatus.className = 'status error';
      loginStatus.textContent = '✕ Invalid username or password.';
      loginPass.value = '';
    }
  }, 900);
});

/* ============ PASSWORD SHOW/HIDE ============ */
eyeBtn.addEventListener('click', () => {
  const isPass = loginPass.type === 'password';
  loginPass.type = isPass ? 'text' : 'password';
  eyeBtn.textContent = isPass ? '🙈' : '👁';
});

/* ============ LOGOUT ============ */
logoutBtn.addEventListener('click', () => {
  if (!confirm('Are you sure you want to log out?')) return;
  appScreen.style.display = 'none';
  loginScreen.classList.remove('hide');
  loginUser.value = '';
  loginPass.value = '';
  loginStatus.textContent = '';
  resetAppState();
});

/* ============================================================
   APP STATE
   ============================================================ */
function initProfile() {
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userId').textContent   = user.id;
  document.getElementById('avatar').textContent   = user.name
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  renderBalance(user.balance);
}

function renderBalance(val) {
  balanceValue.textContent = `$${val.toFixed(2)}`;
}

function resetAppState() {
  selected = null;
  btns.forEach(b => b.classList.remove('active'));
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = '<span>🔐</span> Confirm Payment';
  status.textContent = '';
  status.className = 'status';
  step1.style.display = 'block';
  step2.classList.remove('show');
  errorBox.classList.remove('show');
  document.getElementById('orderNumber').value = '';
  document.getElementById('txId').value = '';
  document.getElementById('senderId').value = '';
  document.getElementById('status2').textContent = '';
  submitProofBtn.disabled = false;
  submitProofBtn.innerHTML = '<span>📤</span> Submit Payment Proof';
}

/* ============================================================
   AMOUNT SELECTION
   ============================================================ */
btns.forEach(btn => {
  btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    selected = parseFloat(btn.dataset.amt);
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = `<span>🔐</span> Confirm Payment of $${selected}`;
    status.textContent = '';
    status.className = 'status';
  });
});

/* ============================================================
   COPY BINANCE ID
   ============================================================ */
copyBtn.addEventListener('click', () => {
  const id = document.getElementById('binanceId').textContent.trim();

  const onSuccess = () => {
    copyBtn.classList.add('copied');
    copyText.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyText.textContent = 'Copy';
    }, 1800);
  };

  navigator.clipboard.writeText(id)
    .then(onSuccess)
    .catch(() => {
      const ta = document.createElement('textarea');
      ta.value = id;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      onSuccess();
    });
});

/* ============================================================
   CONFIRM PAYMENT (simulated network check)
   ============================================================ */
confirmBtn.addEventListener('click', () => {
  if (!selected) return;

  confirmBtn.disabled = true;
  confirmBtn.innerHTML = '<span>⏳</span> Verifying...';
  status.className = 'status pending';
  status.textContent = 'Checking Binance network...';

  setTimeout(() => {
    status.className = 'status success';
    status.textContent = '✓ Payment detected. Please submit your proof below.';
    step2.classList.add('show');
    step2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 1800);
});

/* ============================================================
   SUBMIT PROOF → ALWAYS SHOW ERROR
   ============================================================ */
submitProofBtn.addEventListener('click', () => {
  const order   = document.getElementById('orderNumber').value.trim();
  const txid    = document.getElementById('txId').value.trim();
  const sender  = document.getElementById('senderId').value.trim();
  const status2 = document.getElementById('status2');

  /* ---- validation ---- */
  if (!order || !txid || !sender) {
    status2.className = 'status error';
    status2.textContent = '⚠️ Please fill in all fields.';
    return;
  }
  if (order.length < 4) {
    status2.className = 'status error';
    status2.textContent = '⚠️ Order number looks invalid.';
    return;
  }
  if (txid.length < 8) {
    status2.className = 'status error';
    status2.textContent = '⚠️ Transaction ID too short.';
    return;
  }

  submitProofBtn.disabled = true;
  submitProofBtn.innerHTML = '<span>⏳</span> Verifying payment...';
  status2.className = 'status pending';
  status2.textContent = 'Validating with Binance network...';

  /* ---- simulated check delay ---- */
  setTimeout(() => {
    status2.className = 'status pending';
    status2.textContent = 'Cross-checking transaction ID...';

    setTimeout(() => {
      /* ---- ALWAYS FAIL ---- */
      step2.classList.remove('show');
      errorBox.classList.add('show');
      document.getElementById('errorRef').textContent = 'REF: ' + (order.toUpperCase() || '—');
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

      status2.textContent = '';

      /* ---- simulated backend log ---- */
      console.log('[SIMULATION] Payment verification FAILED:', {
        amount: '$' + selected,
        orderNumber: order,
        transactionId: txid,
        senderId: sender,
        reason: 'Transaction not found on network',
        timestamp: new Date().toISOString()
      });

    }, 1500);
  }, 1600);
});

/* ============================================================
   RETRY
   ============================================================ */
retryBtn.addEventListener('click', () => {
  errorBox.classList.remove('show');
  step2.classList.add('show');

  /* reset submit button */
  submitProofBtn.disabled = false;
  submitProofBtn.innerHTML = '<span>📤</span> Submit Payment Proof';

  document.getElementById('status2').textContent = '';
  document.getElementById('status2').className = 'status';

  /* clear inputs (optional — user re-enters) */
  document.getElementById('orderNumber').value = '';
  document.getElementById('txId').value = '';
  document.getElementById('senderId').value = '';

  step2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
