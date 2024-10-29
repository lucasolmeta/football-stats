const searchBar = document.getElementById('searchBar');

searchBar.addEventListener('keydown', submissionMade);
searchBar.addEventListener('input',changeMade);
window.addEventListener('resize', resizeScreen);

resizeScreen();

function submissionMade(e){
    if(e.key=='Enter'){
        let searchQuery = document.getElementById('searchBar').value;

        const regex = /^[a-zA-Z\s\-]+$/;
        
        if(!regex.test(searchQuery)){
            document.getElementById('errorField').innerHTML = "Only letters, spaces, and hyphens are allowed!";
            return;
        }
        else{
            let url = "https://football-stats-8ab918624cd1.herokuapp.com/search/";
            searchQuery = searchQuery.replace(" ","-");
            url += searchQuery;

            let data = fetchData(url);

            console.log(data);
        }
    }
}

function fetchData(url){
    fetch(url)
  .then( res => res.json ())
  .then(
    function(data){
      return data;
    }
  )
}

function changeMade(){
    document.getElementById('errorField').innerHTML = "";
}

function resizeScreen (){

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
}
