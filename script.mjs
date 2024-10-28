const response = await fetch('https://football-stats-8ab918624cd1.herokuapp.com/data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
});

document.getElementById(body).innerHTML = reponse;