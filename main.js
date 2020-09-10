// Main game data.
var gameData = {
    game_version: 0.1,
    clicks: 0,
    amount_per_click: 1,
    click_rate: 1,
    increase_click_power_cost: 10,
    lastTick: Date.now()
}

//Converts number to number formatted with commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Load save data if exists and if version number matches
var load_game = JSON.parse(localStorage.getItem("clicker_save"))
if (load_game !== null && load_game.game_version == gameData.game_version) {
    gameData = load_game

    //After load ensure elements are updated on screen
    document.getElementById("power").innerHTML = numberWithCommas(gameData.amount_per_click) + " Click Power"
    document.getElementById("power_cost").innerHTML = "Cost: " + numberWithCommas(gameData.increase_click_power_cost)
}

//Main clicking function increments by amounts_per_click
function onClick() {
    gameData.clicks += gameData.amount_per_click
    document.getElementById("clicks").innerHTML = numberWithCommas(gameData.clicks) + " Times Clicked"
}

//Adds 1 click power and doubles price of next buy
function increase_click_power() {
    if (gameData.clicks >= gameData.increase_click_power_cost) {

        gameData.clicks -= gameData.increase_click_power_cost
        gameData.amount_per_click += 1
        gameData.increase_click_power_cost *= 2
        document.getElementById("power").innerHTML = numberWithCommas(gameData.amount_per_click) + " Click Power"
        document.getElementById("power_cost").innerHTML = "Cost: " + numberWithCommas(gameData.increase_click_power_cost)

    }

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

//Main auto click loop
var main_loop = window.setInterval(
    function() {
        diff = Date.now() - gameData.lastTick
        gameData.lastTick = Date.now()
        gameData.clicks += (Math.round(gameData.amount_per_click * (diff / 1000)))
        document.getElementById("clicks").innerHTML = numberWithCommas(gameData.clicks) + " Times Clicked"
    }
,1000)