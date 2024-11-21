export { fetchDataByIdAndSeason };
export { fetchSeasonsById };
export { fetchGraphByIdAndStat };

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('resize', resizeScreen);

    const searchBar = document.getElementById('searchBar');

    searchBar.addEventListener('keydown', submissionMade);
    searchBar.addEventListener('input',changeMade);

    resizeScreen();
});

async function submissionMade(e){
    if(e.key=='Enter'){
        document.querySelectorAll('.buttons').forEach(element => element.remove());

        let searchQuery = document.getElementById('searchBar').value;

        const regex = /^[a-zA-Z\s\-]+$/;
        
        if(searchQuery == ""){
            document.getElementById('errorField').innerHTML = "Please enter a player name!";
            return;
        }
        else if(!regex.test(searchQuery)){
            document.getElementById('errorField').innerHTML = "Only letters, spaces, and hyphens are allowed!";
            return;
        }
        else if(searchQuery.length<3){
            document.getElementById('errorField').innerHTML = "Please type at least 3 characters!";
            return;
        }
        else{
            let data = await fetchDataByName(searchQuery);

            if(data.length == 0){
                document.getElementById('errorField').innerHTML = "No players found for " + document.getElementById('searchBar').value;
                return;
            } else if (data.length == 1){
                let playerId = data[0].player.id;

                let playerStats = await fetchDataById(playerId);
                playerStats = JSON.stringify(playerStats);

                localStorage.setItem('data', playerStats);
                switchToResults();

                return;     
            } else {
                let playerNames = [];
                let playerIds = [];

                for(let i = 0; i < data.length; i++){
                    if((data[i].player.firstname == null && data[i].player.lastname==null) || data[i].player.id == null){
                        data.splice(i, i+1);
                        i--;
                    }
                }

                for(let i = 0; i < data.length; i++){
                    playerNames.push("");
                    playerIds.push(data[i].player.id);

                    if(data[i].player.firstname != null){
                        playerNames[i]+=data[i].player.firstname;
                    }

                    if(data[i].player.firstname != null && data[i].player.lastname!=null){
                        playerNames[i]+=" ";
                    }

                    if(data[i].player.lastname!=null){
                        playerNames[i]+=data[i].player.lastname;
                    }
                }

                buildNameOptions(playerNames, playerIds);
            }
        }
    }
}

function buildNameOptions(playerNames, playerIds){
    for(let i = 0; i < playerNames.length; i++){
        const button = document.createElement('button');

        button.className = 'buttons';
        button.id = 'button' + i;
        button.innerHTML = playerNames[i];

        button.addEventListener('click', () => buttonClicked(playerIds[i]));

        document.body.appendChild(button);
    }

    resizeScreen();
}

async function buttonClicked(playerId){
    let playerStats = await fetchDataById(playerId);
    playerStats = JSON.stringify(playerStats);

    localStorage.setItem('data', playerStats);
    switchToResults();

    return;     
}

async function fetchDataByName(searchQuery) {
    let url = "https://football-stats-8ab918624cd1.herokuapp.com/search/";
    searchQuery = searchQuery.replace(" ","-");
    url += searchQuery;

    try {
        let data = await fetch(url);

        if (!data.ok) {
            throw new Error('Network response was not ok');
        }

        data = await data.json();

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchDataById(id) {
    let url = "https://football-stats-8ab918624cd1.herokuapp.com/id/";
    url += id;

    try {
        let data = await fetch(url);
    
        if (!data.ok) {
            throw new Error('Network response was not ok');
        }

        data = await data.json();
        
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchDataByIdAndSeason(id, season) {
    let url = "https://football-stats-8ab918624cd1.herokuapp.com/playerseason/";
    url += id + "/" + season;

    try {
        let data = await fetch(url);

        if (!data.ok) {
            throw new Error('Network response was not ok');
        }

        data = await data.json();

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchSeasonsById(id){
    let url = "https://football-stats-8ab918624cd1.herokuapp.com/playerseasons/";
    url += id;

    try {
        let data = await fetch(url);

        if (!data.ok) {
            throw new Error('Network response was not ok');
        }

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchGraphByIdAndStat(id, param){
    let url = "https://football-stats-8ab918624cd1.herokuapp.com/graph/";
    url += id + "/" + param;

    try {
        let data = await fetch(url);

        if (!data.ok) {
            throw new Error('Network response was not ok');
        }

        data = await data.json();

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function changeMade(){
    document.getElementById('errorField').innerHTML = "";
}

async function switchToResults(){
    let html = await fetch('./results.html');
    html = await html.text();

    document.open();
    document.write(html);
    document.close();
}

function resizeScreen(){

    //-------------- SET LINKEDIN BUTTON PROPERTIES --------------//

    const linkedIn = document.getElementById('linkedInButton');

    const linkedInHeight = window.innerHeight/27*2;

    if(window.innerHeight<1050){
        linkedIn.style.marginTop = linkedInHeight/6 + 'px';
        linkedIn.style.marginRight = linkedInHeight/6 + 'px';
        linkedIn.style.height = linkedInHeight + 'px';
    } else {
        linkedIn.style.marginTop = '13px';
        linkedIn.style.marginRight = '13px';
        linkedIn.style.height = '52px';
    }

    //-------------- SET SEARCH BAR PROPERTIES --------------//

    const searchBar = document.getElementById('searchBar');

    const searchBarWidth = window.innerWidth/1.9;
    const searchBarHeight = window.innerHeight/12;
    const searchBarTop = window.innerHeight/2 - searchBarHeight/2;
    const searchBarLeft = window.innerWidth/2 - searchBarWidth/2;

    searchBar.style.width = searchBarWidth + 'px';
    searchBar.style.height = searchBarHeight + 'px';
    searchBar.style.lineHeight = searchBarHeight + 'px';
    searchBar.style.borderRadius = searchBarHeight + 'px';
    searchBar.style.fontSize = searchBarHeight*0.45 + 'px';
    searchBar.style.paddingLeft = searchBarHeight/2 + 'px';
    searchBar.style.top = searchBarTop + 'px';
    searchBar.style.left = searchBarLeft + 'px';

    //-------------- SET ERROR FIELD PROPERTIES --------------//

    const errorField = document.getElementById('errorField');

    const errorFieldTop = searchBarTop + searchBarHeight + 5;

    errorField.style.width = searchBarWidth + 'px';
    errorField.style.height = searchBarHeight/4 + 'px';
    errorField.style.lineHeight = searchBarHeight/4 + 'px';
    errorField.style.fontSize = searchBarHeight*0.25 + 'px';
    errorField.style.paddingLeft = searchBarHeight/2 + 'px';
    errorField.style.paddingTop = searchBarHeight/16 + 'px';
    errorField.style.top = errorFieldTop + 'px';
    errorField.style.left = searchBarLeft + 'px';

    let i = 0;

    document.querySelectorAll('.buttons').forEach((button, i) => {
        button.style.width = searchBarWidth + 'px';
        button.style.height = searchBarHeight + 'px';
        button.style.lineHeight = searchBarHeight + 'px';
        button.style.borderRadius = searchBarHeight + 'px';
        button.style.fontSize = searchBarHeight*0.45 + 'px';
        button.style.paddingLeft = searchBarHeight/2 + 'px';
        button.style.paddingRight = searchBarHeight/2 + 'px';
        button.style.top = searchBarTop + searchBarHeight + i*searchBarHeight + 'px';
        button.style.left = searchBarLeft + 'px';
    });
}