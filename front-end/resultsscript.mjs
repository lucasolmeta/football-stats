import { fetchHeadshotById } from './script.mjs';

let data = localStorage.getItem('data');
let seasons = localStorage.getItem('seasons');
let graphs = localStorage.getItem('graphs');

data = JSON.parse(data);
seasons = JSON.parse(seasons);
graphs = JSON.parse(graphs);

let yearSelected = seasons[seasons.length - 1];

let param = "goals";

console.log(graphs);

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('resize', resizeScreen);

    const seasonSelect = document.getElementById('seasonSelect');
    seasonSelect.addEventListener('change', seasonChanged);

    const regraphButton = document.getElementById('regraph');
    regraphButton.addEventListener('click', displayGraph);

    buildDisplay();
});

async function buildDisplay(){

    generateSeasons();

    displayBasicInfo();

    displayBasicStats();

    displayHeadshot();

    displayGraph(data[0].player_id);
    
    resizeScreen();
}

async function seasonChanged(){
    const seasonSelect = document.getElementById('seasonSelect');

    yearSelected = parseInt(seasonSelect.value.toString().slice(0,4));

    generateSeasons();
    displayBasicInfo();
    displayBasicStats();
}

async function generateSeasons(){
    seasonSelect.innerHTML = "";

    if(data && data[0]){
        if(seasons.length == 0){
            const sectionOne = document.getElementById('section1');

            sectionOne.remove();
        } else {
            for(let i = seasons.length - 1; i > 0; i--){
                if(seasons[i].toString().slice(0,4) != yearSelected.toString().slice(0,4)){
                    const newOption = document.createElement("option");
                    const nextYear = (parseInt(seasons[i]) + 1).toString().substring(-2);

                    newOption.text = "";
                    newOption.value = "";

                    newOption.text = seasons[i] + "/" + nextYear;
                    newOption.value = seasons[i] + "/" + nextYear;

                    seasonSelect.add(newOption);
                }
            }

            if(yearSelected){
                const newOption = document.createElement("option");
                const nextYear = (yearSelected + 1).toString().substring(-2);

                newOption.text = yearSelected + "/" + nextYear;
                newOption.value = yearSelected + "/" + nextYear;

                seasonSelect.insertBefore(newOption, seasonSelect.options[0]);
            }

            seasonSelect.selectedIndex = 0;
        }
    }
}

function displayBasicInfo(){
    const basicInfo = document.getElementById('basicinfo');

    if (!data || !data[0]) {
        basicInfo.style.color = 'red';
        basicInfo.innerHTML = "No Basic Information Found";
    } else {
        basicInfo.innerHTML = "<span class='title'>BASIC INFO: </span><br><br>";

        let name = "NAME: <span class='answer'>";

        if(data[0].firstname && data[0].lastname){
            name += data[0].firstname + " " + data[0].lastname;
            name += "</span><br>";

            basicInfo.innerHTML += name;
        } else {
            name += data[0].player_name;
            name += "</span><br>";

            basicInfo.innerHTML += name;
        }

        let teams = "";

        for(let i = 0; i < data.length; i++){
            if(data[i].season && parseInt(data[i].season.slice(0,4)) == yearSelected){
                let teamAdded = false;

                for(let j = i - 1; j >= 0; j--){
                    if((data[j].team_name == data[i].team_name && parseInt(data[j].season.slice(0,4)) == yearSelected) || data[i].team_name == "null"){
                        teamAdded = true;
                        break;
                    }
                }

                if(!teamAdded){
                    if(teams != ""){
                        teams += ", ";
                    }

                    teams += data[i].team_name;
                }
            }
        }

        if(teams.includes(",")){
            teams = "TEAMS: <span class='answer'>" + teams + "</span>";
            teams += "</span><br>";
        } else if (teams.length >6){
            teams = "TEAM: <span class='answer'>" + teams + "</span>";
            teams += "</span><br>";
        } else {
            teams = "";
        }

        basicInfo.innerHTML += teams;

        if(data[0].nationality){
            let country = "COUNTRY: <span class='answer'>";

            country += data[0].nationality;
            country += "</span><br>";
            basicInfo.innerHTML += country;
        }

        if(data[0].position){
            let position = "POSITION: <span class='answer'>";

            position += data[0].position;
            position += "</span><br>";
            basicInfo.innerHTML += position;
        }

        if(data[0].age){
            let age = "AGE: <span class='answer'>";

            age += data[0].age;
            age += "</span><br>";
            basicInfo.innerHTML += age;
        }

        if(data[0].height){
            let height = "HEIGHT: <span class='answer'>";

            height += data[0].height;
            height += "</span><br>";
            basicInfo.innerHTML += height;
        }

        if(data[0].weight){
            let weight = "WEIGHT: <span class='answer'>";

            weight += data[0].weight;
            weight += "</span><br>";
            basicInfo.innerHTML += weight;
        }

        if(data[0].birth_date){
            let birthday = "BIRTHDAY: <span class='answer'>";

            birthday += data[0].birth_date;
            birthday += "</span><br>";
            basicInfo.innerHTML += birthday;
        }

        if(basicInfo.innerHTML.trim() === ""){
            basicInfo.style.color = 'red';
            basicInfo.innerHTML = "No Basic Information Found";
        }
    }
}

function displayBasicStats(){
    const basicStats = document.getElementById('basicstats');

    if (!data || !data[0]) {
        basicStats.style.color = 'red';
        basicStats.innerHTML = "No Basic Stats Found";
    } else {
        basicStats.innerHTML = "<span class='title'>BASIC STATS: </span><br><br>";

        let apps = 0;
        let minutes = 0;
        let goals = 0;
        let assists = 0;
        let totalRating = 0.0;
        let ratingApps = 0;

        data.forEach((dataSet) => {
            if(dataSet.season && dataSet.season.slice(0,4) == yearSelected){
                if(dataSet.games.appearences){
                    apps += dataSet.games.appearences;

                    if(dataSet.rating){
                        totalRating += dataSet.rating * dataSet.games.appearences;
                        ratingApps += dataSet.games.appearences;
                    }
                }

                if(dataSet.games.minutes_played){
                    minutes += dataSet.games.minutes_played;
                }

                if(dataSet.goals.total){
                    goals += dataSet.goals.total;
                }

                if(dataSet.goals.assists){
                    assists += dataSet.goals.assists;
                }
            }
        });

        let appearanceText = "APPEARANCES: <span class='answer'>";
        appearanceText += apps;
        appearanceText += "</span><br>";
        basicStats.innerHTML += appearanceText;

        let minuteText = "MINUTES: <span class='answer'>";
        minuteText += minutes;
        minuteText += "</span><br>";
        basicStats.innerHTML += minuteText;

        let goalText = "GOALS: <span class='answer'>";
        goalText += goals;
        goalText += "</span><br>";
        basicStats.innerHTML += goalText;

        let assistText = "ASSISTS: <span class='answer'>";
        assistText += assists;
        assistText += "</span><br>";
        basicStats.innerHTML += assistText;

        let rating = totalRating / ratingApps;
        rating = rating.toFixed(2);

        if(rating && rating != 0 && rating != "NaN"){
            let ratingText = "AVERAGE RATING: <span class='answer'>";
            ratingText += rating;
            ratingText += "</span><br>";
            basicStats.innerHTML += ratingText;
        }
    }

    resizeScreen();
}

async function displayHeadshot(){
    const headshot = document.getElementById('headshot');

    let photoLink = await fetchHeadshotById(data[0].player_id);

    headshot.src = photoLink;
}

function displayGraph(){
    if(document.getElementById('goals').checked == true && param != "goals"){
        param = "goals";
    } else if(document.getElementById('assists').checked == true && param != "assists"){
        param = "assists";
    } else if(document.getElementById('games').checked == true && param != "games"){
        param = "games";
    }

    let imgData = "";

    if(param == "goals"){
        imgData = graphs.goals;
    } else if(param == "assists"){
        imgData = graphs.assists;
    } else if(param == "games"){
        imgData = graphs.games;
    }

    if(imgData){
        const graph = document.getElementById('graph');
        graph.src = 'data:image/png;base64,' + imgData;
    }
}

function resizeScreen(){

    //-------------- SET HEADER PROPERTIES --------------//

    const header = document.getElementById('header');

    const headerHeight = window.innerHeight/12;

    if(window.innerHeight<1050){
        header.style.height = headerHeight + 'px';
    } else {
        header.style.height = '57px';
        header.style.paddingTop = '13px';
        header.style.paddingRight = '13px';
    }

    const headerText = document.getElementById('headerText');

    headerText.style.fontSize = headerHeight/2 + 'px';
    headerText.style.lineHeight = headerHeight + 'px';
    headerText.style.paddingLeft = headerHeight/4 + 'px';

    //-------------- SET BODY PROPERTIES --------------//

    if(window.innerHeight<1050){
        document.body.style.paddingTop = headerHeight + 'px';
    } else {
        document.body.style.paddingTop = '57px';
    }

    //-------------- SET LINKEDIN BUTTON PROPERTIES --------------//

    const linkedIn = document.getElementById('linkedInButton');

    const linkedInHeight = window.innerHeight/15;

    if(window.innerHeight<1050){
        linkedIn.style.height = linkedInHeight + 'px';
        linkedIn.style.marginTop = headerHeight/10 + 'px';
        linkedIn.style.marginRight = headerHeight/10  + 'px';
    } else {
        linkedIn.style.height = '46px';
        linkedIn.style.marginTop = '13px';
        linkedIn.style.marginRight = '13px';
    }

    //-------------- SET SECTION ONE PROPERTIES --------------//
    
    if(document.getElementById('section1')){
        
        const sectionOne = document.getElementById('section1');

        sectionOne.style.paddingTop = window.innerWidth/65 + 'px';

        const seasonSelect = document.getElementById('seasonSelect');

        seasonSelect.style.fontSize = headerHeight/4 + 'px';
        seasonSelect.style.borderRadius = window.innerWidth/50 + 'px';
        seasonSelect.style.paddingTop = headerHeight/8 + 'px';
        seasonSelect.style.paddingBottom = headerHeight/8 + 'px';
        seasonSelect.style.paddingLeft = headerHeight/4 + 'px';
    }

    //-------------- SET SECTION TWO PROPERTIES --------------//

    const sectionTwo = document.getElementById('section2');

    sectionTwo.style.paddingTop = window.innerWidth/65 + 'px';

    const basicInfo = document.getElementById('basicinfo');
    const basicStats = document.getElementById('basicstats');

    basicInfo.style.fontSize = headerHeight/4 + 'px';
    basicInfo.style.padding = window.innerWidth/75 + 'px';
    basicInfo.style.borderRadius = window.innerWidth/50 + 'px';

    basicStats.style.fontSize = headerHeight/4 + 'px';
    basicStats.style.padding = window.innerWidth/75 + 'px';
    basicStats.style.borderRadius = window.innerWidth/50 + 'px';

    const titleFontSize = headerHeight/2.7;

    document.querySelectorAll('.title').forEach((title) => {
        title.style.fontSize = titleFontSize + 'px';
    });

    //-------------- SET SECTION THREE PROPERTIES --------------//
    
    const sectionThree = document.getElementById('section3');

    sectionThree.style.paddingTop = window.innerWidth/65 + 'px';

    const headshot = document.getElementById('headshot');

    headshot.style.borderRadius = window.innerWidth/50 + 'px';

    const graphDiv = document.getElementById('graphdiv');

    graphDiv.style.fontSize = headerHeight/4 + 'px';
    graphDiv.style.padding = window.innerWidth/75 + 'px';
    graphDiv.style.borderRadius = window.innerWidth/50 + 'px';
}