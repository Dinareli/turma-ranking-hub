chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tab.active) {
        chrome.storage.local.get("value", function (result) {
            if (result.value) {
                const url = tab.url;

                if (url && url.includes("mbanobrainer.com")) {
                    fetch(`http://localhost:8080/api/user-rankings/${result.value}/add-point`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                    })
                        .then(res => res.json())
                        .then(data => console.log("Ponto adicionado com sucesso", data))
                        .catch(err => console.warn("Erro ao adicionar ponto:", err));
                }

            }
        })
    }
});