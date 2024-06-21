class Player {
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
    }

    recordWin() {
        this.wins++;
    }

    recordLoss() {
        this.losses++;
    }

    recordDraw() {
        this.draws++;
    }
}

class TicTacToe {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1;
        this.board = Array(9).fill(null);
        this.positions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
    }

    makeMove(index) {
        if (!this.board[index]) {
            this.board[index] = this.currentPlayer.symbol;
            document.querySelector(`button[data-i="${index}"]`).innerHTML = this.currentPlayer.symbol;
            if (this.checkWin()) {
                alert(`${this.currentPlayer.name} ganhou!`);
                this.currentPlayer.recordWin();
                this.getOpponent().recordLoss();
                this.updateRanking();
                this.resetGame();
            } else if (this.board.every(cell => cell)) {
                alert('Empate!');
                this.player1.recordDraw();
                this.player2.recordDraw();
                this.updateRanking();
                this.resetGame();
            } else {
                this.switchPlayer();
            }
        }
    }

    checkWin() {
        return this.positions.some(position =>
            position.every(index => this.board[index] === this.currentPlayer.symbol)
        );
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        document.querySelector(".currentPlayer").innerHTML = `JOGADOR DA VEZ: ${this.currentPlayer.name}`;
    }

    getOpponent() {
        return this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    resetGame() {
        this.board.fill(null);
        document.querySelectorAll('.game button').forEach(button => button.innerHTML = '');
    }

    updateRanking() {
        localStorage.setItem('ranking', JSON.stringify([
            {name: this.player1.name, wins: this.player1.wins, losses: this.player1.losses, draws: this.player1.draws},
            {name: this.player2.name, wins: this.player2.wins, losses: this.player2.losses, draws: this.player2.draws},
        ]));
        this.displayRanking();
    }

    displayRanking() {
        const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
        const rankingList = document.getElementById('ranking');
        rankingList.innerHTML = ranking.map(player =>
            `<li>${player.name} - Vitórias: ${player.wins}, Derrotas: ${player.losses}, Empates: ${player.draws}</li>`
        ).join('');
    }
}

document.getElementById('startGame').addEventListener('click', () => {
    const player1Name = document.getElementById('player1').value;
    const player2Name = document.getElementById('player2').value;
    if (player1Name && player2Name) {
        const player1 = new Player(player1Name, 'X');
        const player2 = new Player(player2Name, 'O');
        const game = new TicTacToe(player1, player2);

        document.querySelector('.game-container').style.display = 'flex';
        document.querySelector('.player-info').style.display = 'none';
        document.querySelector('.currentPlayer').innerHTML = `JOGADOR DA VEZ: ${game.currentPlayer.name}`;

        document.querySelectorAll('.game button').forEach(button => {
            button.addEventListener('click', (e) => game.makeMove(e.target.getAttribute('data-i')));
        });

        game.displayRanking();
    } else {
        alert('Por favor, insira os nomes dos dois jogadores.');
    }
});
