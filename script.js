class Jogador {
    constructor(nome, simbolo) {
        this.nome = nome;
        this.simbolo = simbolo;
        this.vitorias = 0;
        this.derrotas = 0;
        this.empates = 0;
    }

    registrarVitoria() {
        this.vitorias++;
    }

    registrarDerrota() {
        this.derrotas++;
    }

    registrarEmpate() {
        this.empates++;
    }
}

class JogoDaVelha {
    constructor(jogador1, jogador2, contraComputador = false) {
        this.jogador1 = jogador1;
        this.jogador2 = jogador2;
        this.jogadorAtual = jogador1;
        this.tabuleiro = Array(9).fill(null);
        this.posicoes = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        this.contraComputador = contraComputador;
    }

    fazerJogada(index) {
        if (!this.tabuleiro[index]) {
            this.tabuleiro[index] = this.jogadorAtual.simbolo;
            document.querySelector(`button[data-i="${index}"]`).innerHTML = this.jogadorAtual.simbolo;
            if (this.verificarVitoria()) {
                alert(`${this.jogadorAtual.nome} ganhou!`);
                this.jogadorAtual.registrarVitoria();
                this.getOponente().registrarDerrota();
                this.atualizarRanking();
                this.reiniciarJogo();
            } else if (this.tabuleiro.every(celula => celula)) {
                alert('Empate!');
                this.jogador1.registrarEmpate();
                this.jogador2.registrarEmpate();
                this.atualizarRanking();
                this.reiniciarJogo();
            } else {
                this.alternarJogador();
                if (this.contraComputador && this.jogadorAtual === this.jogador2) {
                    this.jogadaComputador();
                }
            }
        }
    }

    verificarVitoria() {
        return this.posicoes.some(posicao =>
            posicao.every(index => this.tabuleiro[index] === this.jogadorAtual.simbolo)
        );
    }

    alternarJogador() {
        this.jogadorAtual = this.jogadorAtual === this.jogador1 ? this.jogador2 : this.jogador1;
        document.querySelector(".jogador-atual").innerHTML = `JOGADOR DA VEZ: ${this.jogadorAtual.nome}`;
    }

    getOponente() {
        return this.jogadorAtual === this.jogador1 ? this.jogador2 : this.jogador1;
    }

    reiniciarJogo() {
        this.tabuleiro.fill(null);
        document.querySelectorAll('.tabuleiro button').forEach(botao => botao.innerHTML = '');
        this.jogadorAtual = this.jogador1;
        document.querySelector(".jogador-atual").innerHTML = `JOGADOR DA VEZ: ${this.jogadorAtual.nome}`;
    }

    atualizarRanking() {
        const ranking = JSON.parse(localStorage.getItem('ranking')) || {};
        ranking[this.jogador1.nome] = {
            vitorias: this.jogador1.vitorias,
            derrotas: this.jogador1.derrotas,
            empates: this.jogador1.empates
        };
        ranking[this.jogador2.nome] = {
            vitorias: this.jogador2.vitorias,
            derrotas: this.jogador2.derrotas,
            empates: this.jogador2.empates
        
        };
        localStorage.setItem('ranking', JSON.stringify([
            { nome: this.jogador1.nome, vitorias: this.jogador1.vitorias, derrotas: this.jogador1.derrotas, empates: this.jogador1.empates },
            { nome: this.jogador2.nome, vitorias: this.jogador2.vitorias, derrotas: this.jogador2.derrotas, empates: this.jogador2.empates },
        ]));
        this.exibirRanking();
    }

    exibirRanking() {
        const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
        const listaRanking = document.getElementById('ranking');
        listaRanking.innerHTML = ranking.map(jogador =>
            `<li>${jogador.nome} - Vitórias: ${jogador.vitorias}, Derrotas: ${jogador.derrotas}, Empates: ${jogador.empates}</li>`
        ).join('');
    }

    jogadaComputador() {
        const indicesVazios = this.tabuleiro.map((celula, index) => celula === null ? index : null).filter(index => index !== null);
        const indexAleatorio = indicesVazios[Math.floor(Math.random() * indicesVazios.length)];
        if (indexAleatorio !== -1) {
            setTimeout(() => this.fazerJogada(indexAleatorio), 500);
        }
    }
}

let jogo = null;

document.getElementById('iniciar-jogo').addEventListener('click', () => {
    const nomeJogador1 = document.getElementById('jogador1').value;
    const nomeJogador2 = document.getElementById('jogador2').value;
    if (nomeJogador1 && nomeJogador2) {
        const jogador1 = new Jogador(nomeJogador1, 'X');
        const jogador2 = new Jogador(nomeJogador2, 'O');
         jogo = new JogoDaVelha(jogador1, jogador2);

        document.querySelector('.container-jogo').style.display = 'flex';
        document.querySelector('.info-jogador').style.display = 'none';
        document.querySelector('.jogador-atual').innerHTML = `JOGADOR DA VEZ: ${jogo.jogadorAtual.nome}`;

        document.querySelectorAll('.tabuleiro button').forEach(botao => {
            botao.addEventListener('click', (e) => jogo.fazerJogada(e.target.getAttribute('data-i')));
        });

        jogo.exibirRanking();
    } else {
        alert('Por favor, insira os nomes dos dois jogadores.');
    }
});

document.getElementById('jogar-computador').addEventListener('click', () => {
    const nomeJogador1 = document.getElementById('jogador1').value;
    if (nomeJogador1) {
        const jogador1 = new Jogador(nomeJogador1, 'X');
        const jogador2 = new Jogador('Computador', 'O');
         jogo = new JogoDaVelha(jogador1, jogador2, true);

        document.querySelector('.container-jogo').style.display = 'flex';
        document.querySelector('.info-jogador').style.display = 'none';
        document.querySelector('.jogador-atual').innerHTML = `JOGADOR DA VEZ: ${jogo.jogadorAtual.nome}`;

        document.querySelectorAll('.tabuleiro button').forEach(botao => {
            botao.addEventListener('click', (e) => jogo.fazerJogada(e.target.getAttribute('data-i')));
        });

        jogo.exibirRanking();
    } else {
        alert('Por favor, insira o nome do jogador.');
    }
});

document.getElementById('zerar-ranking').addEventListener('click', () =>{ 
    if (jogo){ 
        localStorage.removeItem('ranking'); 

        jogo.jogador1.vitorias = 0;
        jogo.jogador1.derrotas = 0;
        jogo.jogador1.empates = 0;

        jogo.jogador2.vitorias = 0;
        jogo.jogador2.derrotas = 0;
        jogo.jogador2.empates = 0;

        jogo.exibirRanking(); 

        alert("Ranking zerado!");
    } else { 
        alert("Nenhum jogo em andamento!");
    }
}); 

document.getElementById('voltar-menu').addEventListener('click', () => { 
    document.querySelector('.container-jogo').style.display = 'none';
    document.querySelector('.info-jogador').style.display = 'flex'; 
    alert("Voltando ao Menu Principal");
});