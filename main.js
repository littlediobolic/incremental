// Main game data.
var gameData = {
    game_version: 0.1,
    clicks: 0,
    amount_per_click: 1,
    //click_rate: 1,
    increase_click_power_cost: 10,
    //increase_click_rate_cost: 1000,
    silos: 0,
    silo_price: 100,

    click_timer: 1000,
    lastTick: Date.now()
}

//Converts number to number formatted with commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Function to allow me to forcefully update an element by id and what to put there
function update(id, content){
    document.getElementById(id).innerHTML = content
}

// Automatically savve the game to 'clicker save' every 15 seconds
var auto_save_game = window.setInterval(
    function() {
        localStorage.setItem("clicker_save", JSON.stringify(gameData))
    }
,15000)

//Load save data if exists and if version number matches
var load_game = JSON.parse(localStorage.getItem("clicker_save"))
if (load_game !== null && load_game.game_version == gameData.game_version) {
    gameData = load_game

    //After load ensure elements are updated on screen
    document.getElementById("power").innerHTML = numberWithCommas(gameData.amount_per_click) + " Click Power"
    document.getElementById("power_cost").innerHTML = "Cost: " + numberWithCommas(gameData.increase_click_power_cost)
}
else if (load_game !== null && load_game.game_version !== gameData.game_version) {
    window.alert("Failed to load save! Old save is on: " + load_game.game_version + " and this client is running: " + gameData.game_version)
}

//Main clicking function increments by amounts_per_click
function onClick() {
    gameData.clicks += gameData.amount_per_click
    document.getElementById("clicks").innerHTML = numberWithCommas(gameData.clicks) + " Times Clicked"
}

// function increase_click_rate() {
//     if (gameData.clicks >= gameData.increase_click_rate_cost) {
//         gameData.clicks -= gameData.increase_click_rate_cost
//         gameData.click_rate += 1
//         gameData.increase_click_rate_cost = (1000 * Math.pow(1.05, gameData.click_rate))
//         gameData.click_timer = gameData.click_timer * 0.99
//         document.getElementById("click_rate").innerHTML = "Click Rate: Once every " + gameData.click_timer + "ms"
//         document.getElementById("click_rate_cost").innerHTML = "Cost: " + numberWithCommas(gameData.increase_click_rate_cost)
//     }

// }

//Adds 1 click power and doubles price of next buy
function increase_click_power() {
    if (gameData.clicks >= gameData.increase_click_power_cost) {
        gameData.clicks -= gameData.increase_click_power_cost
        gameData.amount_per_click += 1
        gameData.increase_click_power_cost = Math.round(10 * Math.pow(1.05, gameData.amount_per_click))
        document.getElementById("power").innerHTML = numberWithCommas(gameData.amount_per_click) + " Click Power"
        document.getElementById("power_cost").innerHTML = "Cost: " + numberWithCommas(gameData.increase_click_power_cost)

    }

}

function increase_silos() {
    if (gameData.clicks >= gameData.silo_price) {
        gameData.clicks -= gameData.silo_price
        gameData.silos += 1
        gameData.silo_price = Math.round(100 * Math.pow(1.05, gameData.silos))
        document.getElementById("silo").innerHTML = numberWithCommas(gameData.silos) + " Click Silo(s)"
        document.getElementById("silo_cost").innerHTML = "Cost: " + numberWithCommas(gameData.silo_price)
    }

}

//Main auto click loop
var main_loop = window.setInterval(
    function() {
        diff = Date.now() - gameData.lastTick
        gameData.lastTick = Date.now()
        gameData.clicks += (Math.round(gameData.amount_per_click * (diff / 1000)))
        document.getElementById("clicks").innerHTML = numberWithCommas(gameData.clicks) + " Times Clicked"
    }
,1000)