window.addEventListener('resize', resizeScreen);

resizeScreen();

let data = window.localStorage.getItem('data');
data = JSON.parse(data);
data = data.response[0];

console.log(data);

buildDisplay();

function buildDisplay(){
    const basicInfo = document.getElementById('basicinfo');
    const basicStats = document.getElementById('basicstats');

    //-------------- DISPLAY BASIC INFO --------------//

    if (!data || !data.player) {
        basicInfo.style.color = 'red';
        basicInfo.innerHTML = "No Advanced Information Found";
        return;
    }

    if(data.player.name != undefined){
        let name = "NAME: ";

        name += data.player.name;
        name += "<br>";

        basicInfo.innerHTML += name;
    }

    if(data.player.nationality != undefined){
        let country = "COUNTRY: ";

        country += data.player.nationality;
        country += "<br>";

        basicInfo.innerHTML += country;
    }

    if(data.player.position != undefined){
        let position = "POSITION: ";

        position += data.player.position;
        position += "<br>";

        basicInfo.innerHTML += position;
    }

    if(data.player.age != undefined){
        let age = "AGE: ";

        age += data.player.age;
        age += "<br>";

        basicInfo.innerHTML += age;
    }

    if(data.player.number != undefined){
        let number = "NUMBER: ";

        number += data.player.number;
        number += "<br>";

        basicInfo.innerHTML += number;
    }

    if(data.player.height != undefined){
        let height = "HEIGHT: ";

        height += data.player.height;
        height += "<br>";

        basicInfo.innerHTML += height;
    }

    if(data.player.weight != undefined){
        let weight = "NUMBER: ";

        weight += data.player.weight;
        weight += "<br>";

        basicInfo.innerHTML += weight;
    }

    if(data.player.birth.date != undefined){
        let birthday = "BIRTHDAY: ";

        birthday += data.player.birth.date;
        birthday += "<br>";

        basicInfo.innerHTML += birthday;
    }

    if(basicInfo.innerHTML.trim() === ""){
        basicInfo.style.color = 'red';
        basicInfo.innerHTML = "No Advanced Information Found";
    }

    //-------------- DISPLAY BASIC STATS --------------//

    if (!data || !data.statistics) {
        basicInfo.style.color = 'red';
        basicInfo.innerHTML = "No Advanced Information Found";
        return;
    }


    let goals = 0;
    let assists = 0;
    let caps = 0;

    for(let i = 0; i < data.statistics.length; i++){
        if(data.statistics[i].goals.total != undefined){
            goals += data.statistics[i].goals.total;
        }

        if(data.statistics[i].goals.assists != undefined){

        }

        if(data.statistics[i].games.appearances != undefined){
            caps += data.statistics[i].games.appearances;
        }
    }

    if(basicStats.innerHTML.trim() === ""){
        basicStats.style.color = 'red';
        basicStats.innerHTML = "No Advanced Stats Found";
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
    
    const sectionOne = document.getElementById('section1');

    if(window.innerHeight<1050){
        sectionOne.style.top = headerHeight + 'px';
    } else {
        sectionOne.style.top = '57px';
    }
    sectionOne.style.paddingTop = window.innerWidth/65 + 'px';
    sectionOne.style.paddingBottom = window.innerWidth/65 + 'px';

    const basicInfo = document.getElementById('basicinfo');
    const basicStats = document.getElementById('basicstats');

    basicStats.style.fontSize = headerHeight/4 + 'px';
    basicStats.style.padding = window.innerWidth/75 + 'px';
    basicStats.style.borderRadius = window.innerWidth/50 + 'px';

    basicInfo.style.fontSize = headerHeight/4 + 'px';
    basicInfo.style.padding = window.innerWidth/75 + 'px';
    basicInfo.style.borderRadius = window.innerWidth/50 + 'px';
}
