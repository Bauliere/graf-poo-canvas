// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color; // Nuevo: color de la pelota
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color; // Usar el color definido
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia dirección al resetear
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, color, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color; // Nuevo: color de la paleta
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = this.color; // Usar el color definido
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    // Movimiento de la paleta automática (IA)
    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        // Crear 5 pelotas con diferentes tamaños, velocidades, colores y ángulos
        this.balls = [
            new Ball(canvas.width / 2, canvas.height / 2, 8, 3, 3, '#FF5733'),  // Pelota 1: pequeña y lenta
            new Ball(canvas.width / 2, canvas.height / 2, 15, 5, 5, '#33FF57'), // Pelota 2: mediana y rápida
            new Ball(canvas.width / 2, canvas.height / 2, 10, 2, 2, '#3357FF'), // Pelota 3: pequeña y muy lenta
            new Ball(canvas.width / 2, canvas.height / 2, 20, 6, 6, '#FF33A1'), // Pelota 4: grande y rápida
            new Ball(canvas.width / 2, canvas.height / 2, 12, 4, 4, '#A133FF')   // Pelota 5: mediana y velocidad media
        ];

        // Crear paletas con colores distintos
        this.paddle1 = new Paddle(0, canvas.height / 2 - 50, 10, 200, '#FFC300', true); // Paleta 1 (Jugador)
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100, '#C70039'); // Paleta 2 (IA)

        this.keys = {}; // Para capturar las teclas
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar todas las pelotas
        this.balls.forEach(ball => ball.draw());

        // Dibujar las paletas
        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        // Mover todas las pelotas
        this.balls.forEach(ball => ball.move());

        // Movimiento de la paleta 1 (Jugador) controlado por teclas
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        // Movimiento de la paleta 2 (Controlada por IA)
        this.paddle2.autoMove(this.balls[0]); // Seguir la primera pelota

        // Colisiones con las paletas para todas las pelotas
        this.balls.forEach(ball => {
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
                ball.speedX = -ball.speedX;
            }

            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
                ball.speedX = -ball.speedX;
            }

            // Detectar cuando la pelota sale de los bordes (punto marcado)
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });
    }

    // Captura de teclas para el control de la paleta
    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();