document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;
      if (!localStorage.getItem(phone)) {
        const user = { password, balance: 1000 };
        localStorage.setItem(phone, JSON.stringify(user));
        alert("Registration successful!");
        window.location.href = "login.html";
      } else {
        alert("Phone number already registered!");
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = document.getElementById("loginPhone").value;
      const password = document.getElementById("loginPassword").value;
      const user = JSON.parse(localStorage.getItem(phone));
      if (user && user.password === password) {
        localStorage.setItem("currentUser", phone);
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        alert("Invalid phone or password.");
      }
    });
  }

  const balanceEl = document.getElementById("balance");
  if (balanceEl) {
    const phone = localStorage.getItem("currentUser");
    const user = JSON.parse(localStorage.getItem(phone));
    let balance = user.balance;
    let timeLeft = 30;
    let period = 1;
    let selectedColor = null;
    let selectedSize = null;
    let history = [];

    const updateDisplay = () => {
      balanceEl.textContent = balance;
      document.getElementById("timeLeft").textContent = timeLeft;
      document.getElementById("period").textContent = period;
    };

    window.selectColor = (color) => { selectedColor = color; };
    window.selectSize = (size) => { selectedSize = size; };

    window.placeBet = () => {
      const amount = 100;
      if (balance < amount) return alert("Not enough balance");
      const winColor = ["Red", "Green", "Violet"][Math.floor(Math.random() * 3)];
      const winSize = Math.random() < 0.5 ? "Big" : "Small";
      let win = false;
      if (selectedColor === winColor || selectedSize === winSize) {
        balance += amount;
        win = true;
      } else {
        balance -= amount;
      }
      user.balance = balance;
      localStorage.setItem(phone, JSON.stringify(user));
      const resultText = `Color: ${winColor}, Size: ${winSize} | Your Bet: ${selectedColor}/${selectedSize} → ${win ? "✅ Win" : "❌ Lose"}`;
      document.getElementById("roundResult").textContent = resultText;
      history.unshift(resultText);
      if (history.length > 100) history.pop();
      document.getElementById("historyList").innerHTML = history.join("<br>");
      updateDisplay();
      period++;
    };

    updateDisplay();
    setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        timeLeft = 30;
        window.placeBet();
      }
      document.getElementById("timeLeft").textContent = timeLeft;
    }, 1000);
  }
});
