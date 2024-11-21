import { fetchDataByIdAndSeason } from './script.mjs';
import { fetchSeasonsById } from './script.mjs';
import { fetchGraphByIdAndStat } from './script.mjs';

let data = localStorage.getItem('data');
data = JSON.parse(data);

let yearSelected;
let param = "goals";

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('resize', resizeScreen);

    const seasonSelect = document.getElementById('seasonSelect');
    seasonSelect.addEventListener('change', seasonChanged);

    const regraphButton = document.getElementById('regraph');
    regraphButton.addEventListener('click', regraph);

    buildDisplay();
});

async function buildDisplay(){

    generateSeasons();

    displayBasicInfo();

    displayBasicStats();

    displayHeadshot();

    displayGraph(data.player.id, param);
    
    resizeScreen();

}

async function seasonChanged(){
    const choice = parseInt(seasonSelect.value.substring(0,4));
    yearSelected = parseInt(seasonSelect.value.substring(0,4));

    data = await fetchDataByIdAndSeason(data.player.id, choice);

    buildDisplay();
}

async function generateSeasons(){
    seasonSelect.innerHTML = "";

    if(data && data.player){
        let seasons = await fetchSeasonsById(data.player.id);

        seasons = await seasons.json();

        if(seasons.length == 0){
            const sectionOne = document.getElementById('section1');

            sectionOne.remove();
        } else {
            for(let i = seasons.length-1; i >= 0; i--){
                if(seasons[i] != yearSelected){
                    const newOption = document.createElement("option");
                    const nextYear = (seasons[i] + 1).toString().substring(-2);

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

    if (!data || !data.player) {
        basicInfo.style.color = 'red';
        basicInfo.innerHTML = "No Basic Information Found";
    } else {
        basicInfo.innerHTML = "<span class='title'>BASIC INFO: </span><br><br>";

        if(data.player.name != undefined){
         let name = "NAME: <span class='answer'>";

            name += data.player.name;
            name += "</span><br>";

            basicInfo.innerHTML += name;
        }

        if(data.statistics && data.statistics[0].team.name && data.statistics.length == 1){
            let team = "TEAM: <span class='answer'>";

            team += data.statistics[0].team.name;

            team += "</span><br>";
            basicInfo.innerHTML += team;
        } else if (data.statistics && data.statistics[0].team.name && data.statistics.length > 1){
            let teams = "<span class='answer'>";
            teams += data.statistics[0].team.name;

            for(let i = 1; i < data.statistics.length; i++){
                let teamAdded = false;

                for(let j = i - 1; j >= 0; j--){
                    if(data.statistics[j].team.name == data.statistics[i].team.name){
                        teamAdded = true;
                    }
                }

                if(!teamAdded){
                    teams += ", ";
                    teams += data.statistics[i].team.name;
                }
            }

            if(teams.includes(",")){
                teams = "TEAMS: " + teams;
            } else {
                teams = "TEAM: " + teams;
            }

            teams += "</span><br>";
            basicInfo.innerHTML += teams;
        }

        if(data.player.nationality != undefined){
            let country = "COUNTRY: <span class='answer'>";

            country += data.player.nationality;
            country += "</span><br>";

            basicInfo.innerHTML += country;
        }

        if(data.statistics && data.statistics[0].games.position != undefined){
            let position = "POSITION: <span class='answer'>";

            position += data.statistics[0].games.position;
            position += "</span><br>";

            basicInfo.innerHTML += position;
        }

        if(data.player.age != undefined){
            let age = "AGE: <span class='answer'>";

            age += data.player.age;
            age += "</span><br>";

            basicInfo.innerHTML += age;
        }

        if(data.player.height != undefined){
            let height = "HEIGHT: <span class='answer'>";

            height += data.player.height;
            height += "</span><br>";

            basicInfo.innerHTML += height;
        }

        if(data.player.weight != undefined){
            let weight = "WEIGHT: <span class='answer'>";

            weight += data.player.weight;
            weight += "</span><br>";

            basicInfo.innerHTML += weight;
        }

        if(data.player.birth.date != undefined){
            let birthday = "BIRTHDAY: <span class='answer'>";

            birthday += data.player.birth.date;
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

    if (!data || !data.statistics) {
        basicStats.style.color = 'red';
        basicStats.innerHTML = "No Basic Stats Found";
    } else {
        basicStats.innerHTML = "<span class='title'>BASIC STATS: </span><br><br>";

        let caps = 0;
        let minutes = 0;
        let goals = 0;
        let assists = 0;
        let rating = 0.0;
        let ratingCaps = 0;

        for(let i = 0; i < data.statistics.length; i++){
            if(data.statistics[i].games.appearences != undefined){
                caps += data.statistics[i].games.appearences;

                if(data.statistics[i].games.rating != null && data.statistics[i].games.rating != 0){
                    rating += data.statistics[i].games.appearences * data.statistics[i].games.rating;
                    ratingCaps += data.statistics[i].games.appearences;
                }
            }

            if(data.statistics[i].games.minutes != undefined){
                minutes += data.statistics[i].games.minutes;
            }

            if(data.statistics[i].goals.total != undefined){
                goals += data.statistics[i].goals.total;
            }

            if(data.statistics[i].goals.assists != undefined){
                assists += data.statistics[i].goals.assists;
            }
        }

        if(ratingCaps != 0){
            rating /= ratingCaps;
            rating = rating.toFixed(2);
        }

        let appearanceText = "APPEARANCES: <span class='answer'>";
        appearanceText += caps;
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

        if(rating && rating != 0){
            let ratingText = "AVERAGE RATING: <span class='answer'>";
            ratingText += rating;
            ratingText += "</span><br>";
            basicStats.innerHTML += ratingText;

            if(basicStats.innerHTML.trim() === ""){
                basicStats.style.color = 'red';
                basicStats.innerHTML = "No Basic Stats Found";
            }
        }
    }
}

function displayHeadshot(){
    const headshot = document.getElementById('headshot');

    if(!data || !data.player || !data.player.photo){
        headshot.src = 'https://media.api-sports.io/football/players/434267.png';
    } else {
        headshot.src = data.player.photo;
    }
}

async function displayGraph(id, param){
    let imgData = await fetchGraphByIdAndStat(id, param);

    if(imgData && imgData.image){
        const graph = document.getElementById('graph');
        graph.src = 'data:image/png;base64,' + imgData.image;
    }
}

function regraph(){
    if(document.getElementById('goals').checked == true && param != "goals"){
        param = "goals";
    } else if(document.getElementById('assists').checked == true && param != "assists"){
        param = "assists";
    } else if(document.getElementById('games').checked == true && param != "games"){
        param = "games";
    }

    displayGraph(data.player.id,param);
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
