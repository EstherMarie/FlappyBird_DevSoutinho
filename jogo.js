console.log('[DevSoutinho] Flappy Bird');
console.log(
	'Inscreva-se no canal :D https://www.youtube.com/channel/UCzR2u5RWXWjUh7CwLSvbitA'
);

let frames = 0;
const som_Hit = new Audio();
som_Hit.src = './efeitos/hit.wav';

const som_Pulo = new Audio();
som_Pulo.src = './efeitos/pulo.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const planoDeFundo = {
	spriteX: 390,
	spriteY: 0,
	largura: 275,
	altura: 204,
	x: 0,
	y: canvas.height - 204,
	desenha() {
		contexto.fillStyle = '#70c5ce';
		contexto.fillRect(0, 0, canvas.width, canvas.height);

		contexto.drawImage(
			sprites,
			planoDeFundo.spriteX,
			planoDeFundo.spriteY,
			planoDeFundo.largura,
			planoDeFundo.altura,
			planoDeFundo.x,
			planoDeFundo.y,
			planoDeFundo.largura,
			planoDeFundo.altura
		);

		contexto.drawImage(
			sprites,
			planoDeFundo.spriteX,
			planoDeFundo.spriteY,
			planoDeFundo.largura,
			planoDeFundo.altura,
			planoDeFundo.x + planoDeFundo.largura,
			planoDeFundo.y,
			planoDeFundo.largura,
			planoDeFundo.altura
		);
	},
};

function criaChao() {
	const chao = {
		spriteX: 0,
		spriteY: 610,
		largura: 224,
		altura: 112,
		x: 0,
		y: canvas.height - 112,
		atualiza() {
			const movimentoDoChao = 1;
			const repeteEm = chao.largura / 2;
			const movimentacao = (chao.x -= movimentoDoChao);
			chao.x = movimentacao % repeteEm;

			// console.log('[chao.x]', chao.x);
			// console.log('[repeteEm]',repeteEm);
			// console.log('[movimentacao]', movimentacao % repeteEm);
		},
		desenha() {
			contexto.drawImage(
				sprites,
				chao.spriteX,
				chao.spriteY,
				chao.largura,
				chao.altura,
				chao.x,
				chao.y,
				chao.largura,
				chao.altura
			);

			contexto.drawImage(
				sprites,
				chao.spriteX,
				chao.spriteY,
				chao.largura,
				chao.altura,
				chao.x + chao.largura,
				chao.y,
				chao.largura,
				chao.altura
			);
		},
	};

	return chao;
}

function fazColisao(flappyBird, chao) {
	const flappyBirdY = flappyBird.y + flappyBird.altura;
	const chaoY = chao.y;

	if (flappyBirdY >= chaoY) {
		return true;
	}

	return false;
}

function criaFlappyBird() {
	const flappyBird = {
		spriteX: 0,
		spriteY: 0,
		largura: 33,
		altura: 24,
		x: 10,
		y: 50,
		pulo: 4.6,
		pula() {
			// console.log('devo pular');
			// console.log('[antes]', flappyBird.velocidade);
			flappyBird.velocidade = -flappyBird.pulo;
			som_Pulo.play();
			// console.log('[depois]', flappyBird.velocidade);
		},
		gravidade: 0.25,
		velocidade: 0,
		atualiza() {
			if (fazColisao(flappyBird, globais.chao)) {
				console.log('Fez colisão');
				som_Hit.play();

				setTimeout(() => {
					mudaParaTela(Telas.INICIO);
				}, 500);

				return;
			}

			flappyBird.velocidade += flappyBird.gravidade;
			flappyBird.y += flappyBird.velocidade;
		},
		movimentos: [
			{ spriteX: 0, spriteY: 0 }, // asa pra cima
			{ spriteX: 0, spriteY: 26 }, // asa no meio
			{ spriteX: 0, spriteY: 52 }, // asa pra baixo
			{ spriteX: 0, spriteY: 26 }, // asa no meio
		],
		frameAtual: 0,
		atualizaOFrameAtual() {
			const intervaloDeFrames = 10;
			const passouOIntervalo = frames % intervaloDeFrames === 0;
			// console.log(passouOIntervalo);

			if (passouOIntervalo) {
				const baseDoIncremento = 1;
				const incremento = baseDoIncremento + flappyBird.frameAtual;
				const baseRepeticao = flappyBird.movimentos.length;
				flappyBird.frameAtual = incremento % baseRepeticao;
			}
		},
		desenha() {
			// Sim, desenha() é uma função, assim como function desenha()!
			/* ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) s=source image | d = destination canvas*/
			this.atualizaOFrameAtual();
			const { spriteX, spriteY } = this.movimentos[this.frameAtual];
			contexto.drawImage(
				sprites,
				spriteX,
				spriteY, // Sprite X, Sprite Y
				flappyBird.largura,
				flappyBird.altura, // Sprite Width (largura), Sprite Height(altura)
				flappyBird.x,
				flappyBird.y, // Local onde vai aparacer o sprite no canvas
				flappyBird.largura,
				flappyBird.altura // Tamanho do sprite dentro do canvas
			);
		},
	};

	return flappyBird;
}

const mensagemGetReady = {
	sX: 134,
	sY: 0,
	w: 174,
	h: 152,
	x: canvas.width / 2 - 174 / 2,
	y: 50,
	desenha() {
		contexto.drawImage(
			sprites,
			mensagemGetReady.sX,
			mensagemGetReady.sY,
			mensagemGetReady.w,
			mensagemGetReady.h,
			mensagemGetReady.x,
			mensagemGetReady.y,
			mensagemGetReady.w,
			mensagemGetReady.h
		);
	},
};

function criaCanos() {
	const canos = {
		largura: 52,
		altura: 400,
		chao: {
			spriteX: 0,
			spriteY: 169,
		},
		ceu: {
			spriteX: 52,
			spriteY: 169,
		},
		espaco: 80,
		desenha() {
			canos.pares.forEach(par => {
				const yRandom = par.y;
				const espacamentoEntreCanos = 90;

				const canoCeuX = par.x;
				const canoCeuY = yRandom;

				// Cano do Céu
				contexto.drawImage(
					sprites,
					canos.ceu.spriteX,
					canos.ceu.spriteY,
					canos.largura,
					canos.altura,
					canoCeuX,
					canoCeuY,
					canos.largura,
					canos.altura
				);

				// Cano do Chão
				const canoChaoX = par.x;
				const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
				contexto.drawImage(
					sprites,
					canos.chao.spriteX,
					canos.chao.spriteY,
					canos.largura,
					canos.altura,
					canoChaoX,
					canoChaoY,
					canos.largura,
					canos.altura
				);

				par.canoCeu = {
					x: canoCeuX,
					y: canos.altura + canoCeuY,
				};
				par.canoChao = {
					x: canoChaoX,
					y: canoChaoY,
				};
			});
		},
		temColisaoComOFlappyBird(par) {
			const cabecaDoFlappy = globais.flappyBird.y;
			const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

			if (globais.flappyBird.x >= par.x) {
				// console.log('colidiu');

				if (cabecaDoFlappy <= par.canoCeu.y) {
					return true;
				}

				if (peDoFlappy >= par.canoChao.y) {
					return true;
				}
			}
			return false;
		},
		pares: [],
		atualiza() {
			const passou100Frames = frames % 100 === 0;
			if (passou100Frames) {
				canos.pares.push({
					x: canvas.width,
					y: -150 * (Math.random() + 1),
				});
			}

			canos.pares.forEach(par => {
				par.x = par.x - 2;

				if (canos.temColisaoComOFlappyBird(par)) {
					console.log('Você perdeu');
					mudaParaTela(Telas.INICIO);
				}

				if (par.x + canos.largura <= 0) {
					canos.pares.shift();
				}
			});
		},
	};

	return canos;
}

//
// Telas
//
const globais = {};

let telaAtiva = {};
function mudaParaTela(novaTela) {
	telaAtiva = novaTela;

	if (telaAtiva.inicializa) {
		telaAtiva.inicializa();
	}
}

const Telas = {
	INICIO: {
		inicializa() {
			globais.flappyBird = criaFlappyBird();
			globais.canos = criaCanos();
			globais.chao = criaChao();
		},
		desenha() {
			planoDeFundo.desenha();
			globais.chao.desenha();
			globais.flappyBird.desenha();
			mensagemGetReady.desenha();
		},
		click() {
			mudaParaTela(Telas.JOGO);
		},
		atualiza() {
			globais.chao.atualiza();
		},
	},
};

Telas.JOGO = {
	desenha() {
		planoDeFundo.desenha();
		globais.canos.desenha();
		globais.chao.desenha();
		globais.flappyBird.desenha();
	},
	click() {
		globais.flappyBird.pula();
	},
	atualiza() {
		globais.canos.atualiza();
		globais.chao.atualiza();
		globais.flappyBird.atualiza();
	},
};

function loop() {
	telaAtiva.desenha();
	telaAtiva.atualiza();

	frames += 1;
	requestAnimationFrame(loop);
}

window.addEventListener('click', () => {
	if (telaAtiva.click) {
		telaAtiva.click();
	}
});

mudaParaTela(Telas.INICIO);
loop();
