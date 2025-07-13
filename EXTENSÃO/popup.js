document.getElementById("btn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    const url = tab.url;

    document.getElementById("output").textContent = url;
    chrome.storage.local.set({ nome: "Mike" });

    chrome.storage.local.get("nome", function (result) {
      document.getElementById("output").textContent ="Nome salvo:"+ result.nome;
    });
  });
});