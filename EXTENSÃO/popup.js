chrome.storage.local.get("value", function (result) {
  if (result.value) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      const url = tab.url;

      if (url && url.includes("mbanobrainer.com")) {
        fetch(`http://localhost:8080/api/user-rankings/${result.value}/add-point`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        })
          .then(res => res.json())
          .then(data => document.getElementById("container").innerHTML = `Bem vindo a plataforma <button id="logoutBtn">Sair</button>`)
          .catch(err => document.getElementById("container").innerHTML = `Usuário não está em um ranking. Vá a plataforma para participar de uma`);
      }else {
        document.getElementById("container").innerHTML = `Site não compatível com ferramenta`
      }
    })
  }
})

document.getElementById("loginBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const emailField = document.getElementById('email').value
    const passwordField = document.getElementById('password').value

    fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: emailField, password: passwordField })
    })
      .then(response => response.json())
      .then(data => {
        chrome.storage.local.set({ value: data.id })
        window.close()
      })
      .catch(() => {
        document.getElementById("output").textContent = "Login/Senha incorretos";
      });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      chrome.storage.local.remove("value", () => {
        document.getElementById("container").innerHTML = `
          <input type="text" id="email">
          <input type="password" id="password">
          <button id="loginBtn">Acessar</button>
          <div id="output"></div>
        `;
        window.close()
      });
    });
  }
});