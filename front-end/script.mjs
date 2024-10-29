window.addEventListener('resize', resizeScreen);

resizeScreen();

function resizeScreen (){
    const searchBar = document.getElementById('searchBar');

    const searchBarWidth = window.innerWidth/1.9;
    const searchBarHeight = window.innerHeight/12;
    const searchBarMarginTop = window.innerHeight/2 - searchBarHeight/2;
    const searchBarMarginLeft = window.innerWidth/2 - searchBarWidth/2;

    searchBar.style.width = searchBarWidth + 'px';
    searchBar.style.height = searchBarHeight + 'px';
    searchBar.style.borderRadius = searchBarHeight + 'px';
    searchBar.style.fontSize = searchBarHeight*0.45 + 'px';
    searchBar.style.paddingLeft = searchBarHeight/2 + 'px';
    searchBar.style.marginTop = searchBarMarginTop + 'px';
    searchBar.style.marginLeft = searchBarMarginLeft + 'px';
}
