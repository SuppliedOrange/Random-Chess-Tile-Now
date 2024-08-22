document.addEventListener("DOMContentLoaded", () => {

    const coinImage = document.querySelector('.coin-image');
    const coinContainer = document.querySelector('.coin-container');

    coinContainer.addEventListener('animationiteration', () => {
        coinImage.src = coinImage.src.includes("pawn.png") ? './images/dice.png' : './images/pawn.png';
    });

    let loadIntoChessComButton = document.querySelector("#loadIntoChessComButton");
    loadIntoChessComButton.onclick = () => tryLoadIntoChessCom();

    let loadRandomizerPanelButton = document.querySelector("#loadRandomizerPanelButton");
    loadRandomizerPanelButton.onclick = () => switchToRandomizerPanel();

    let newTileButton = document.querySelector("#newTileButton");
    newTileButton.onclick = () => getAndUpdateRandomTile();

})

function tryLoadIntoChessCom() {

    chrome.tabs.query({active: true, lastFocusedWindow: true}, async tabs => {

        let url = tabs[0].url;
        const chessRegex = /^(https?:\/\/)?(www\.)?chess\.com\/.*/;

        if (!url.match(chessRegex)) {

            let loadIntoChessComButton = document.querySelector("#loadIntoChessComButton");
            loadIntoChessComButton.innerText = "You're not on chess.com"
            await new Promise(r => setTimeout(r, 4000));
            loadIntoChessComButton.innerText = "Load into current chess.com game"
            return;
        };

        try { await executeButtonInjection(); }

        catch (e) {

            loadIntoChessComButton.innerText = "Fatal error. Check console for info."
            console.error(e);
            await new Promise(r => setTimeout(r, 4000));
            loadIntoChessComButton.innerText = "Load into current chess.com game"

        }

    });

}

function switchToRandomizerPanel() {

    let randomizerPanel = document.querySelector("#randomizerPanel");
    let mainPanel = document.querySelector("#mainPanel");

    mainPanel.style.display = "none";
    randomizerPanel.style.display = "";

}

function getAndUpdateRandomTile() {

    let randomTile = document.querySelector("#randomTile");
    let randomLetter = "abcdefgh".split("")[ Math.floor( Math.random() * 8 ) ];
    let randomNumber = "12345678".split("")[ Math.floor( Math.random() * 8 ) ];
    randomTile.innerText = randomLetter + randomNumber;

}