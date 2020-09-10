// Main game data.
var gameData = {
    game_version: 0.1,
    clicks: 0,
    amount_per_click: 1,
    amount_per_click_coefficient: 1,
    increase_click_power_cost: 10,
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

function update_clicks(){
    document.getElementById("clicks").innerHTML = numberWithCommas(gameData.clicks) + " Times Clicked"
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
    update_clicks()
}

var increase_click_power = { 
    button_increase: function() { //Functions that buttons use to increase click power
        if (gameData.clicks >= gameData.increase_click_power_cost) {
            gameData.clicks -= gameData.increase_click_power_cost
            gameData.amount_per_click += 1
            gameData.amount_per_click_coefficient += 1
            gameData.increase_click_power_cost = Math.round(10 * Math.pow(1.10, gameData.amount_per_click_coefficient))
            document.getElementById("power").innerHTML = numberWithCommas(gameData.amount_per_click) + " Click Power"
            document.getElementById("power_cost").innerHTML = "Cost: " + numberWithCommas(gameData.increase_click_power_cost)
            update_clicks()
    
        }

    },
    tick_increase: function(count) { //function main_loop uses to increase click power
        if (count == null) {
            count = 0
        }
        gameData.amount_per_click += count
        document.getElementById("power").innerHTML = numberWithCommas(gameData.amount_per_click) + " Click Power"
        document.getElementById("power_cost").innerHTML = "Cost: " + numberWithCommas(gameData.increase_click_power_cost)

    }

}

function increase_silos() {
    if (gameData.clicks >= gameData.silo_price) {
        gameData.clicks -= gameData.silo_price
        gameData.silos += 1
        gameData.silo_price = Math.round(500 * Math.pow(1.16, gameData.silos))
        document.getElementById("silo").innerHTML = numberWithCommas(gameData.silos) + " Click Silo(s)"
        document.getElementById("silo_cost").innerHTML = "Cost: " + numberWithCommas(gameData.silo_price)
        update_clicks()
    }

}

//Main auto click loop
var main_loop = window.setInterval(
    function() {
        //Main tick function
        diff = Date.now() - gameData.lastTick
        gameData.lastTick = Date.now()
        gameData.clicks += (Math.round(gameData.amount_per_click * (diff / 1000)))
        document.getElementById("clicks").innerHTML = numberWithCommas(gameData.clicks) + " Times Clicked"

        //increase all other resources on tick
        increase_click_power.tick_increase(gameData.silos)
    }
,1000)