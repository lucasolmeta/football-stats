window.addEventListener('resize', resizeScreen);

resizeScreen();

const data = JSON.parse(window.localStorage.getItem('data'));

console.log(data);

buildDisplay();

function buildDisplay(){
    const basicInfo = document.getElementById('basicinfo');
    const basicStats = document.getElementById('basicstats');

    if(data[0].player.name != undefined){
        let name = "NAME: ";

        name += data[0].player.name;
        name += "<br>";

        basicInfo.innerHTML += name;
    }

    if(data[0].player.nationality != undefined){
        let country = "COUNTRY: ";

        country += data[0].player.nationality;
        country += "<br>";

        basicInfo.innerHTML += country;
    }

    if(data[0].player.position != undefined){
        let position = "POSITION: ";

        position += data[0].player.position;
        position += "<br>";

        basicInfo.innerHTML += position;
    }

    if(data[0].player.age != undefined){
        let age = "AGE: ";

        age += data[0].player.age;
        age += "<br>";

        basicInfo.innerHTML += age;
    }

    if(data[0].player.number != undefined){
        let number = "NUMBER: ";

        number += data[0].player.number;
        number += "<br>";

        basicInfo.innerHTML += number;
    }

    if(data[0].player.height != undefined){
        let height = "HEIGHT: ";

        height += data[0].player.height;
        height += "<br>";

        basicInfo.innerHTML += height;
    }

    if(data[0].player.weight != undefined){
        let weight = "NUMBER: ";

        weight += data[0].player.weight;
        weight += "<br>";

        basicInfo.innerHTML += weight;
    }

    if(data[0].player.birth.date != undefined){
        let birthday = "BIRTHDAY: ";

        birthday += data[0].player.birth.date;
        birthday += "<br>";

        basicInfo.innerHTML += birthday;
    }

    if(basicInfo.innerHTML == ""){
        basicInfo.style.color = 'red';
        basicInfo.innerHTML = "No Advanced Information Found";
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
