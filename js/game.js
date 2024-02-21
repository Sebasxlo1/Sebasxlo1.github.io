document.addEventListener('DOMContentLoaded', () => {
    const game = document.getElementById('game');
    const basket = document.getElementById('basket');
    const scoreCount = document.getElementById('scoreCount');
    let score = 0;

    // Arreglos de razones y disculpas
    const razones = ["Tu lunar del cachete", "Tu forma de ser", "Tu patitas (gg)", "Tu sonrisa", "Tus buenos sentimientos", "Tu gran corazón", "Lo simpática que eres", "Todo de ti", "Tus chistes", "Lo linda que eres conmigo <3"];
    const disculpas = ["Soy intenso", "No he sido caballeroso", "Te causo problemas", "Te molesto", "No he sido atento", "Por ser a veces grosero", "no te chineo", "Tengo malas actitudes", "Te canso", "Solo te doy problemas </3"];
    let razonesUsadas = [];
    let disculpasUsadas = [];

    game.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Evita el desplazamiento de la página mientras se toca
        let gameRect = game.getBoundingClientRect();
        let basketHalfWidth = basket.offsetWidth / 2;
        let newX = e.touches[0].clientX - gameRect.left - basketHalfWidth;
        // Evita que la cesta se salga del juego
        newX = Math.max(0, Math.min(game.offsetWidth - basket.offsetWidth, newX));
        basket.style.left = newX + 'px';
    });

    // Establece un estilo mínimo y contenido para la cesta
    basket.style.background = 'url(/img/Cesta.png) no-repeat center center'; // Ajusta la imagen de la cesta
    basket.style.backgroundSize = 'cover'; // Ajusta el tamaño de la imagen de la cesta
    basket.style.width = '150px'; // Ajusta el ancho de la cesta
    basket.style.height = '150px'; // Ajusta la altura de la cesta
    basket.innerHTML = ''; // Asegúrate de que la cesta no tenga contenido adicional

    // Función para seleccionar una razón aleatoria que no se haya usado antes
    function seleccionarRazon() {
        let razon;
        do {
            razon = razones[Math.floor(Math.random() * razones.length)];
        } while (razonesUsadas.includes(razon));
        razonesUsadas.push(razon);
        return razon;
    }

    // Función para seleccionar una disculpa aleatoria que no se haya usado antes
    function seleccionarDisculpa() {
        let disculpa;
        do {
            disculpa = disculpas[Math.floor(Math.random() * disculpas.length)];
        } while (disculpasUsadas.includes(disculpa));
        disculpasUsadas.push(disculpa);
        return disculpa;
    }

    // Función para hacer caer los corazones
    function dropHeart(isBroken = false) {
        const heart = document.createElement('div');
        heart.className = isBroken ? 'brokenHeart' : 'heart';
        const heartImg = document.createElement('img');
        heartImg.src = isBroken ? '/img/Corazón roto.png' : '/img/Corazón 1.png'; // Asegúrate de que las rutas de las imágenes sean correctas
        heart.appendChild(heartImg);

        const startX = Math.floor(Math.random() * (game.offsetWidth - 50));
        heart.style.left = startX + 'px';
        heart.style.top = '0px';

        game.appendChild(heart);

        // Mover el corazón hacia abajo
        function moveDown() {
            let topVal = parseInt(heart.style.top, 10);
            if (topVal < game.offsetHeight - 50) {
                heart.style.top = topVal + 3.3 + 'px'; // Ajusta la velocidad de caída para adaptarse a dispositivos móviles
                requestAnimationFrame(moveDown);
            } else {
                heart.remove(); // Elimina el corazón cuando llega al fondo
                if (!isBroken) {
                    let razon = seleccionarRazon();
                    if (score < 10) alert(`¿Qué es lo que me gusta de ti?:  ${razon}`); // Muestra la razón seleccionada si el juego aún no ha terminado
                    if (razonesUsadas.length === razones.length) {
                        razonesUsadas = []; // Reinicia el arreglo de razones usadas si se han usado todas
                    }
                } else {
                    let disculpa = seleccionarDisculpa();
                    if (score < 10) alert(`Me disculpa si:  ${disculpa}`); // Muestra la disculpa seleccionada si el juego aún no ha terminado
                    if (disculpasUsadas.length === disculpas.length) {
                        disculpasUsadas = []; // Reinicia el arreglo de disculpas usadas si se han usado todas
                    }
                }
                if (!isBroken && score < 10) dropHeart(Math.random() < 0.3); // 50% de probabilidad de que el siguiente sea roto
            }
        }

        moveDown();

        // Detectar colisión con la cesta
        function checkCollision() {
            let heartRect = heart.getBoundingClientRect();
            let basketRect = basket.getBoundingClientRect();

            if (heartRect.right > basketRect.left &&
                heartRect.left < basketRect.right &&
                heartRect.bottom > basketRect.top &&
                heartRect.top < basketRect.bottom) {
                heart.remove(); // Elimina el corazón si hay colisión
                score += isBroken ? 0 : 1; // Incrementa el puntaje solo si el corazón no está roto
                scoreCount.textContent = score;
                if (!isBroken && score < 10) dropHeart(Math.random() < 0.5); // Continúa el juego hasta alcanzar 10 corazones
                else if (score >= 10) alert('¡Has completado el juego!');
            } else {
                requestAnimationFrame(checkCollision); // Continúa verificando la colisión
            }
        }

        checkCollision();
    }

    // Inicia el juego con un corazón
    dropHeart();
});
