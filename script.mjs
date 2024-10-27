const response = await fetch('https://football-stats.herokuapp.com/api/data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
});

document.getElementById(body).innerHTML = reponse;