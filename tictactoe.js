/*
1.->Aloitus. Pelaaja valitsee pelimuodon ("player VS player/player VS Ai")
2.-> Kun pelaaja on valinnut pelimuodon, peli alkaa painamalla "START"-nappia.  
-> Jos ei valittua pelimuotoa ilmoitus käyttäjälle.
3.->Kun peli on käynnissä sama nappi muuttuu "RESET", jolla palataan kohtaan 2.
*/


/*
Kun peli on pelattu loppuun pelin tulos ilmoitetaan käyttäjälle ja 
palataan takaisin kohtaan (2.)
*/


/*
LISÄYKSIÄ:
-Voi pelata useita eriä
-Lisää AI 
*/


let gamemode = 0; 
let gameStatus = false;
let gameState = ["","","","","","","","",""];
const modetext = document.querySelector('.dropbtn')
const message = document.getElementById('message')
const button = document.querySelector('.btn')
const player2 = document.getElementById('player2')
const player1_item = document.getElementById('item1')
const player2_item = document.getElementById('item2')
const winningMessage = document.getElementById('winning-message')
let currentPlayer = "X";

const handlegamemode = (mode) => {
        return function () {          
            if (!gameStatus) {
                gamemode = mode
                console.log(gamemode)
                if (gamemode === 1) {
                    modetext.innerHTML = 'Player vs Player'
                } else {
                    modetext.innerHTML = 'Player vs AI'
                }
            }
        }        
}


document.getElementById('b1').addEventListener('click', handlegamemode(1))
document.getElementById('b2').addEventListener('click', handlegamemode(2))


const handlegameStart = () => {
    if (button.textContent === 'Stop') {
        resetGame()
    }else {
    switch (gamemode) {
        case 1:
            console.log("Peli aloitettu")
            gameStatus = true;
            player1_item.innerHTML = "X"
            player2_item.innerHTML = "0"
            button.innerHTML = "Stop"
            break;
        case 2:
            // alert("Gamemode (Player vs AI) is not yet implemented")
            console.log("Peli aloitettu")
            gameStatus = true;
            player1_item.innerHTML = "X"
            player2_item.innerHTML = "0"
            player2.innerHTML = "AI"
            button.innerHTML = "Stop"
            break;
        default:
            message.innerHTML = 'You have to chose gamemode first.'
            break;
    }}
}

button.addEventListener('click', handlegameStart)


const handleplayerChange = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (gamemode === 2 && currentPlayer === "O") {
        computersTurn()
    }
}

const handleboxClick = (e) => {
    const box = e.target
    const indexOfBox = parseInt(
        box.getAttribute('cell')
    )
    if (gameState[indexOfBox] !== "" || gameStatus === false) {
        return
    }

    console.log(indexOfBox)
    gameState[indexOfBox] = currentPlayer
    box.innerHTML = currentPlayer
    console.log(gameState)
    checkResult()
}


document.querySelectorAll('.box').forEach(box => box.addEventListener('click', handleboxClick))


const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const checkResult = () => {
    let roundwon = false
    for (let index = 0; index < 7; index++) {
        const element = winningConditions[index];
        let a = gameState[element[0]];
        let b = gameState[element[1]];
        let c = gameState[element[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundwon = true;
            break
        }
    }
    if (roundwon) {
        winningMessage.innerHTML = currentPlayer +" won the game"
        return
    }
    if (checkIfDraw()) {
        winningMessage.innerHTML = "Draw"
        return
    }
    handleplayerChange() 
}

const resetGame = () => {
    console.log("Game reset")
    gamemode = 0;
    gameStatus = false
    currentPlayer = "X"
    gameState = ["","","","","","","","",""]
    button.innerHTML = "Start"
    modetext.innerHTML = 'Gamemode'
    player1_item.innerHTML = ""
    player2_item.innerHTML = ""
    player2.innerHTML = "Pelaaja 2"
    winningMessage.innerHTML = ""
    document.querySelectorAll('.box').forEach(box => box.innerHTML = "")
}

const checkIfDraw = () => {
    let count = 0;
    gameState.forEach(element => {
        if (element.length === 0) {
            count++
        }
    });
    if (count > 0) {
        return false
    }
    return true
}

// AI algorithm

const computersTurn = () => {
    for (let index = 0; index < 7; index++) {
        const element = winningConditions[index];
        let a = gameState[element[0]];
        let b = gameState[element[1]];
        let c = gameState[element[2]];

        /*If win condition only needs 1, item will be placed*/
        if (a === b && a !== "" && b !== "" ||
            b === c && b !== "" && c !== "" ||
            a === c && a !== "" && c !== "") {
            console.log("AI: 2 samalla rivillä")
            if (a === b && c === "") {
                console.log("AI: ab -> "+ a +" "+b)
                gameState[element[2]] = currentPlayer
                findboxByIndex(element[2])
                return
            }
            else if (b === c && a === "") {
                console.log("AI: bc-> "+ b +" "+c)
                gameState[element[0]] = currentPlayer
                findboxByIndex(element[0])             
                return
            }
            else if (a === c && b === "") {
                console.log("AI: ac-> "+ a +" "+c)
                gameState[element[1]] = currentPlayer
                findboxByIndex(element[1])
                return
            }
        }
    }
    const freeBoxes = []
    let x = 0
    gameState.forEach((element, index) => {
        if (element.length === 0) {
            freeBoxes[x] = index
            x++
        }
    })
    let boxindex = freeBoxes[getRandomInt(freeBoxes.length)]
    console.log("testi: "+getRandomInt(freeBoxes.length))
    console.log("pituus: "+freeBoxes.length)
    console.log("AI: Asetetaan indexiin "+ boxindex)
    gameState[boxindex] = currentPlayer
    findboxByIndex(boxindex)
}

const findboxByIndex = (index) => {
    document.querySelectorAll('.box').forEach(box => {
        if (parseInt(box.getAttribute('cell')) === index) {
            box.innerHTML = currentPlayer
            console.log(gameState)
            checkResult()
        }
    }
    )
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
}