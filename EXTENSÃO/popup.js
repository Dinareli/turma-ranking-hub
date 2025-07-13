chrome.storage.local.get("value", function (result) {
  if (result.value) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      const url = tab.url;

      if (url && !url.includes("mbanobrainer.com")) {
        document.getElementById("container").innerHTML = `Site não compatível com ferramenta<button id="logoutBtn">Sair</button>`
      }else {
        document.getElementById("container").innerHTML = `Aproveite as funcionalidades da ferramenta<button id="logoutBtn">Sair</button>`
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


document.addEventListener("click", (event) => {
  if (event.target && event.target.id === "logoutBtn") {
    chrome.storage.local.remove("value", () => {
      document.getElementById("container").innerHTML = `
        <label>Email</label>
        <input type="text" id="email" placeholder="johndoe@gmail.com">
        <label>Senha</label>
        <input type="password" id="password" placeholder="********">
        <button id="loginBtn">Acessar</button>
        <div id="output"></div>
      `;
      window.close();
    });
  }
});

// document.addEventListener("DOMContentLoaded", () => {
//   const logoutBtn = document.getElementById("logoutBtn");
//   if (logoutBtn) {
//     logoutBtn.addEventListener("click", () => {
//       chrome.storage.local.remove("value", () => {
//         document.getElementById("container").innerHTML = `
//           <input type="text" id="email">
//           <input type="password" id="password">
//           <button id="loginBtn">Acessar</button>
//           <div id="output"></div>
//         `;
//         window.close()
//       });
//     });
//   }
// });