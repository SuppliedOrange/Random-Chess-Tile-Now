async function executeButtonInjection() {

    return await chrome.tabs.query( {active: true, currentWindow: true}, function (tabs) {
        
        chrome.scripting.executeScript( { target: {tabId: tabs[0].id},  func: ( () => {

            function generateRandomizerElement () {

                // Container element
                const container = document.createElement("div");
                container.classList.add("randomizerControls");
                container.style.display = "flex";
                container.style.flexDirection = "row";
            
                /**
                 * Random Square Generator button
                 */
                
                const button = document.createElement("button");
                button.id = "randomSquareButton";
                button.classList.add("ui_v5-button-component", "ui_v5-button-basic", "primary-controls-button");
                button.setAttribute("type", "button");
                button.setAttribute("aria-label", "Random Square Generator");
                button.style.marginLeft = "auto";
            
                // Plus Icon
                const icon = document.createElement("span");
                icon.classList.add("icon-font-chess", "ui_v5-button-icon", "plus");
            
                // Button text
                const text = document.createElement("span");
                text.style.fontSize = "small";
                text.innerHTML = "Random<br>Square";
            
                button.appendChild(icon);
                button.appendChild(text);
            
                // Button function
            
                button.onclick = function () {
            
                    let randomLetter = "abcdefgh".split("")[ Math.floor( Math.random() * 8 ) ];
                    let randomNumber = "12345678".split("")[ Math.floor( Math.random() * 8 ) ];
                    let randomSquareValue = document.querySelector("#randomSquareOutputValue");
                    randomSquareValue.innerText = randomLetter + randomNumber;
                    
                }
            
                /**
                 * Output container
                 */
                const outputContainer = document.createElement("div");
                outputContainer.id = "randomSquareOutput";
                outputContainer.style.whiteSpace = "pre-wrap";
                outputContainer.style.marginLeft = "auto";
                outputContainer.style.marginRight = "auto";
            
                // Inner flex column
                const flexColumn = document.createElement("div");
                flexColumn.style.display = "flex";
                flexColumn.style.flexDirection = "column";
                flexColumn.style.textAlign = "center";
            
                // "Move to"
                const moveToText = document.createElement("div");
                moveToText.style.fontSize = "medium";
                moveToText.style.color = "white";
                moveToText.textContent = "Move to";
            
                // Square name
                const squareText = document.createElement("span");
                squareText.id = "randomSquareOutputValue"
                squareText.style.color = "yellow";
                squareText.style.fontSize = "large";
                squareText.textContent = "?";
            
                outputContainer.appendChild(flexColumn);
                flexColumn.appendChild(moveToText);
                flexColumn.appendChild(squareText);
            
                // Append both to container element
                container.appendChild(button);
                container.appendChild(outputContainer);
            
                return container
            
            }
            
            function generateHorizontalDivider() {
            
                return document.createElement("hr");
            
            }
            
            function findAndInject() {
            
                const botGamePanel = document.querySelector(".game-controls-controller-component");
                const liveGamePanel = document.querySelector(".tab-content-component");
                const fourPlayerGamePanel = document.querySelector(".board-panel-content-wrapper");
            
                if (liveGamePanel) {
                    return injectIntoPanel( liveGamePanel,
                        "live-game-buttons-component",
                        [
                            generateHorizontalDivider(),
                            generateRandomizerElement(),
                            generateHorizontalDivider()  
                        ]
                    )
                }
            
                else if (botGamePanel) {
                    return injectIntoPanel( botGamePanel,
                        "small-controls-smallControls",
                        [
                            generateHorizontalDivider(),
                            generateRandomizerElement()
                        ]
                    )
                }

                else if (fourPlayerGamePanel) {
                    return injectIntoPanel( fourPlayerGamePanel,
                        "game-panel-btns-container",
                        [
                            generateHorizontalDivider(),
                            generateRandomizerElement(),
                            generateHorizontalDivider()  
                        ]
                    )
                }
            
                else return new ChessButtonInjectorStatus("NO_PANEL",
                    "Could not find a panel to inject into on the screen",
                    findAndInject.name
                )
            
            }
            
            function injectIntoPanel( panel, beforeElementClassName, elementsToInject ) {
            
                    // Get all the children of the live game panel
                    let panelChildren = Array.from(panel.children);
            
                    let panelIdentifier = `.${panel.className} ${(panel.id) ? `#${panel.id}` : "unidentifiable panel"}`
            
                    let indexOfBeforeElement = 0;
            
                    if (beforeElementClassName) {
                        // Find this specific element in the panel children list, we inject it before this item.
                        let beforeElement = panelChildren.filter( x => x.className == beforeElementClassName );
                        if (!beforeElement) {
                            return new ChessButtonInjectorStatus("NO_BEFORE_ELEMENT",
                                 `Could not find class ${beforeElementClassName} in ${panelIdentifier}`,
                                 `${injectIntoPanel.name} > beforeElement .${panel}`
                            );
                        }
                        indexOfBeforeElement = panelChildren.indexOf(beforeElement[0]);
                    }
            
                    for (const element of elementsToInject) {
                        panelChildren.splice( indexOfBeforeElement, 0, element );
                    }
                
                    panel.innerHTML = "";
                
                    for (const element of panelChildren) {
                        panel.appendChild(element);
                    }
            
                    return new ChessButtonInjectorStatus("SUCCESS",
                        `Finished operation injecting into panel ${panelIdentifier}`,
                        injectIntoPanel
                    )
            
            }
            
            class ChessButtonInjectorStatus {
            
                constructor(type, reason, location) {
            
                    this.type = type;
                    this.reason = reason;
                    this.location = location;
            
                }
            
            }

            return findAndInject();

        }) } )
        .then( async results => {

            let injectResult;
            if (!results.length) injectResult = null;
            else injectResult = results[0].result;

            let loadIntoChessComButton = document.querySelector("#loadIntoChessComButton");

            if (!injectResult) {
                loadIntoChessComButton.innerText = "Unable to get response from browser tab. Report to dev."
            }
            else if (injectResult.type == "SUCCESS") {
                loadIntoChessComButton.innerText = "Successfully loaded."
                console.log(`Random Chess Tile Now: ${injectResult.reason}`);
            }
            else if (injectResult.type == "NO_PANEL") {
                loadIntoChessComButton.innerText = "Unable to find panel to inject self into. You must be in a game."
                console.log(`Random Chess Tile Now Error:\nType:${injectResult.type}\nReason:${injectResult.reason}\nLocation:${injectResult.location}`);
            }
            else {
                loadIntoChessComButton.innerText = "Unknown error, possibly broken due to updates. Complain to dev."
                console.log(`Random Chess Tile Now Error:\nType:${injectResult.type}\nReason:${injectResult.reason}\nLocation:${injectResult.location}`);
            }

            await new Promise(r => setTimeout(r, 4000));
            loadIntoChessComButton.innerText = "Load into current chess.com game"

        })
    })

}