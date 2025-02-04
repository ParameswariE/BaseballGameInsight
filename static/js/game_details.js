document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Game Details Page Loaded!");

    const gamePk = getGamePk();
    if (gamePk) {
        fetchGameVideo(gamePk);
        fetchInnings(gamePk);
    }
});

// ✅ Fix: Correctly Extract `gamePk` from URL Path
function getGamePk() {
    const pathSegments = window.location.pathname.split("/");
    const gamePk = pathSegments[pathSegments.length - 1]; // Get last segment from path

    if (!gamePk || isNaN(gamePk)) {
        console.error("❌ No gamePk found in URL.");
        return null;
    }

    console.log(`🎯 Found gamePk: ${gamePk}`);
    return gamePk;
}

async function fetchGameVideo(gamePk) {
    console.log("🎥 Fetching video for GamePK:", gamePk);

    try {
        const response = await fetch("/get_game_video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gamePk: gamePk }),
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("🔍 Full API Response:", data); // Debugging full response

        if (!data.videoUrl) {
            console.error("❌ Error: `videoUrl` is missing from API response!");
            return;
        }

        // ✅ Ensure video loads correctly
        let videoContainer = document.getElementById("highlightVideo");
        videoContainer.innerHTML = ""; // Clear existing video if any

        let videoElement = document.createElement("video");
        videoElement.setAttribute("controls", "true");
        videoElement.setAttribute("autoplay", "true");
        videoElement.setAttribute("muted", "true"); // Prevent autoplay block
        videoElement.setAttribute("playsinline", "true");
        videoElement.setAttribute("width", "100%"); // Adjust for responsiveness

        let sourceElement = document.createElement("source");
        sourceElement.setAttribute("src", data.videoUrl);
        sourceElement.setAttribute("type", "video/mp4");

        videoElement.appendChild(sourceElement);
        videoContainer.appendChild(videoElement);

        console.log("✅ Video should now be visible and playing!");

    } catch (error) {
        console.error("❌ Error fetching video:", error);
    }
}

// ✅ Fetch and Display Innings as Buttons
function fetchInnings(gamePk) {
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
            inningsList.innerHTML = "";


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

// ✅ Fetch AI Insight for Selected Inning
function fetchInsight(inning) {
    if (!inning || !inning.inning || !inning.half || !inning.event) {
        console.error("❌ Invalid inning data:", inning);
        return;
    }

    console.log("🔍 Fetching insight for:", inning);

    fetch("/get_insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            inning: inning.inning,
            half: inning.half,
            event: inning.event
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("❌ Error fetching AI insight:", data.error);
                return;
            }

            document.getElementById("insightContainer").innerHTML = `
                <h2 class="insight-heading">Real-Time Insight</h2>
                <p class="insight-text">${data.insight}</p>
            `;
        })
        .catch(error => console.error("❌ Error fetching AI insight:", error));
}

