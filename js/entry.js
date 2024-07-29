document.getElementById('form-container').addEventListener('submit', function(event) {
    event.preventDefault();
    const player1Name = document.getElementById('player1').value;
    const player2Name = document.getElementById('player2').value;
    localStorage.setItem('player1Name', player1Name);
    localStorage.setItem('player2Name', player2Name);
    window.location.href = 'index.html';
});
