window.addEventListener('resize', resizeScreen);

resizeScreen();

function resizeScreen (){
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
    searchBar.style.marginRight = searchBarMarginLeft + 'px';
}
