document.addEventListener('DOMContentLoaded', () => {
    const revealButton = document.getElementById('reveal-button');
    const initialScreen = document.getElementById('initial-screen');
    const mainContent = document.getElementById('main-content');
    const relationshipTimeElement = document.getElementById('relationship-time');
    const slideshowImageElement = document.getElementById('slideshow-image');
    const heartsRainContainer = document.querySelector('.hearts-rain-container');

    // --- CONFIGURAÇÕES ---
    // IMPORTANTE: Coloque a data e hora exatas do início do relacionamento
    const relationshipStartDate = new Date('2022-04-04T00:00:00'); // Formato: ANO-MÊS-DIA T HORA:MINUTO:SEGUNDO

    // IMPORTANTE: Substitua pelos caminhos reais das suas fotos
    // Coloque as fotos em uma pasta (ex: 'imagens') e referencie aqui: 'imagens/foto1.jpg'
    const photoSlides = [
        'imagens/foto1.jpg',
        'imagens/foto2.jpg',
        'imagens/foto3.jpg',
        'imagens/foto4.jpg',
        'imagens/foto5.jpg',
        'imagens/foto6.jpg',
        'imagens/foto7.jpg',
        'imagens/foto8.jpg',
        'imagens/foto9.jpg',
        'imagens/foto10.jpg'
    ];
    let currentSlideIndex = 0;
    let relationshipIntervalId = null; // Para controlar o intervalo do timer
    let slideshowIntervalId = null; // Para controlar o intervalo do slideshow

    // --- EVENTO DO BOTÃO INICIAL ---
    revealButton.addEventListener('click', () => {
        initialScreen.classList.add('fade-out'); // Adiciona classe para animação de fade out

        // Espera a animação da tela inicial terminar antes de mostrar o conteúdo principal
        setTimeout(() => {
            initialScreen.classList.add('hidden'); // Esconde de fato após o fade
            mainContent.classList.remove('hidden'); // Remove 'hidden' para que a animação CSS de fadeInContent funcione

            startHeartRain(30); // Inicia a chuva com 30 corações
            updateRelationshipTime(); // Chama uma vez para mostrar imediatamente
            if (relationshipIntervalId) clearInterval(relationshipIntervalId); // Limpa intervalo anterior se houver
            relationshipIntervalId = setInterval(updateRelationshipTime, 1000); // Atualiza a cada segundo

            if (photoSlides.length > 0) {
                displaySlide(); // Mostra o primeiro slide imediatamente
                if (slideshowIntervalId) clearInterval(slideshowIntervalId); // Limpa intervalo anterior
                slideshowIntervalId = setInterval(nextSlide, 5000); // Muda a foto a cada 5 segundos
            }
        }, 500); // Tempo da animação de fade-out da tela inicial (definido no CSS)
    });

    // --- FUNÇÃO PARA ATUALIZAR O TEMPO DE RELACIONAMENTO ---
    function updateRelationshipTime() {
        const now = new Date();
        let diff = now - relationshipStartDate;

        if (diff < 0) {
            relationshipTimeElement.textContent = "A contagem começa em breve!";
            return;
        }

        const sPerMinute = 60;
        const sPerHour = sPerMinute * 60;
        const sPerDay = sPerHour * 24;
        const sPerMonth = sPerDay * 30.4375; // Média de dias por mês
        const sPerYear = sPerDay * 365.25;   // Considera anos bissextos

        let years = Math.floor(diff / (sPerYear * 1000));
        diff -= years * (sPerYear * 1000);

        let months = Math.floor(diff / (sPerMonth * 1000));
        diff -= months * (sPerMonth * 1000);

        let days = Math.floor(diff / (sPerDay * 1000));
        diff -= days * (sPerDay * 1000);

        let hours = Math.floor(diff / (sPerHour * 1000));
        diff -= hours * (sPerHour * 1000);

        let minutes = Math.floor(diff / (sPerMinute * 1000));
        diff -= minutes * (sPerMinute * 1000);

        let seconds = Math.floor(diff / 1000);

        relationshipTimeElement.textContent =
            `${years} anos, ${months} meses, ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos`;
    }

    // --- FUNÇÕES DO SLIDESHOW ---
    function displaySlide() {
        if (photoSlides.length === 0) {
            slideshowImageElement.alt = "Nenhuma foto para exibir.";
            return;
        }
        // Remove a classe 'active' de qualquer slide anterior (se houvesse múltiplos elementos de imagem)
        // Como estamos usando uma única tag <img>, apenas trocamos o src e reativamos a animação de opacidade
        slideshowImageElement.classList.remove('active');

        setTimeout(() => { // Pequeno delay para o efeito de transição
            slideshowImageElement.src = photoSlides[currentSlideIndex];
            slideshowImageElement.alt = `Nossa Memória ${currentSlideIndex + 1}`;
            slideshowImageElement.classList.add('active');
        }, 100); // Delay para permitir que a remoção da classe 'active' seja processada
    }

    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % photoSlides.length;
        displaySlide();
    }

    // --- FUNÇÃO DA CHUVA DE CORAÇÕES ---
    function startHeartRain(numberOfHearts) {
        if (!heartsRainContainer) return;
        heartsRainContainer.innerHTML = ''; // Limpa corações anteriores se houver

        for (let i = 0; i < numberOfHearts; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');

            // Posição horizontal e delay de animação aleatórios
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDelay = Math.random() * 5 + 's'; // Corações caem em momentos diferentes

            // Tamanho aleatório
            const scale = Math.random() * 0.5 + 0.5; // Escala entre 0.5 e 1.0
            heart.style.setProperty('--random-rotate', (Math.random() * 90 - 45) + 'deg'); // Rotação aleatória no final
            heart.style.transform = `scale(${scale}) rotate(-45deg)`; // Rotação inicial para formar o coração

            // Duração da queda um pouco variada
            heart.style.animationDuration = (Math.random() * 3 + 5) + 's'; // Duração entre 5s e 8s

            heartsRainContainer.appendChild(heart);
        }
    }

    // Inicializa o timer uma vez para evitar o "Calculando..." por muito tempo se a tela inicial for pulada
    if (relationshipTimeElement && relationshipTimeElement.textContent === "Calculando...") {
        updateRelationshipTime();
    }
});