document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Controller in scripts.js")
    fetch("/get_all_games")
        .then(res => res.json())
        .then(games => {
            let gamesHtml = "";
            games.forEach(game => {
                gamesHtml += `
                    <div class="game-card">
                        <img src="${game.homeLogo}" alt="Home Team">
                        <img src="${game.awayLogo}" alt="Away Team">
                        <p>${game.homeTeam} vs ${game.awayTeam}</p>
                        <p>${game.score}</p>
                        <button onclick="viewGame(${game.gamePk})">View Game</button>
                    </div>`;
            });
            document.getElementById("gamesContainer").innerHTML = gamesHtml;
        });
    const gamePk = window.location.pathname.split("/").pop(); // Extract GamePK from URL
    fetchInnings(gamePk);
});
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const gamePk = urlParams.get("gamePk");

    if (gamePk) {
        fetchInnings(gamePk);
    } else {
        console.error("❌ No gamePk found in URL.");
    }
});

function fetchInnings() {
    console.log("FetchInnings")
    const urlParams = new URLSearchParams(window.location.search);
    const gamePk = urlParams.get("gamePk");

    if (!gamePk) {
        console.error("❌ No gamePk found in URL.");
        return;
    }

    console.log(`⚾ Fetching innings for GamePK: ${gamePk}`);

    fetch("/get_innings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gamePk })
    })
        .then(response => response.json())
        .then(innings => {
            if (!innings || innings.length === 0) {
                console.error("❌ No inning data received.");
                return;
            }

            console.log("✅ Received innings data:", innings);

            const inningsList = document.getElementById("inningsList");

            // ✅ Check if inningsList exists before updating
            if (!inningsList) {
                console.error("❌ Error: #inningsList element not found in the DOM.");
                return;
            }

            inningsList.innerHTML = ""; // Clear previous content

            innings.forEach(inning => {
                const button = document.createElement("button");
                button.className = "inning-button";
                button.innerText = `Inning ${inning.inning} - ${inning.half}`;
                button.onclick = () => fetchInsight(inning);
                inningsList.appendChild(button);
            });
        })
        .catch(error => console.error("❌ Error fetching innings:", error));
}



function displayInnings(innings) {
    const inningsList = document.getElementById("inningsList");
    inningsList.innerHTML = ""; // Clear previous content

    innings.forEach(inning => {
        const button = document.createElement("button");
        button.className = "inning-button";
        button.innerText = `Inning ${inning.inning} - ${inning.half}`;
        button.onclick = () => fetchInsight(inning);
        inningsList.appendChild(button);
    });
}

function fetchInsight(inning) {
    console.log(`🧠 Fetching AI insight for Inning: ${inning.inning}`);

    fetch("/get_insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inning })
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ AI Insight:", data.insight);
        document.getElementById("aiInsight").innerText = data.insight;
    })
    .catch(error => console.error("❌ Error fetching AI insight:", error));
}

function viewGame(gamePk) {
    window.location.href = `/game_details/${gamePk}`;
}
