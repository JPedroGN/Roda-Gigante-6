// ==========================================
// CONFIGURAÇÕES (Respostas do Login)
// ==========================================
const respostasCorretas = ["chocolate", "morango"];
const cabecalho = document.getElementById("cabecalho");
const galeriaContainer = document.getElementById("galeria-container");

//===========================================
// ARRAY DO CARDÁPIO (Imagens via Thumbnail API do Google)
//===========================================
const cardapio = [
    { etapa: "Entrada", titulo: "Petiscos de Cangote caramelizados", imagem: "https://drive.google.com/thumbnail?id=13SKFfL00tGge8_7loUvZiV4Ew_CwbFoo&sz=w800" },
    { etapa: "Prato<br>Principal", titulo: "Abraço selado na chapa", imagem: "https://drive.google.com/thumbnail?id=1bLaTYoIg6FSPzyPimVKSXffVCuUIpTsx&sz=w800" },
    { etapa: "Bebida", titulo: "RedBull sabor Melatonina", imagem: "https://drive.google.com/thumbnail?id=1-hUeWcBYm7DzAGGCw6eU3ehUD2pOz-TN&sz=w800" },
    { etapa: "Sobremesa", titulo: "Gelato de beijos", imagem: "https://drive.google.com/thumbnail?id=1NubYh6v3BSnjFt6Y7gglGfIfoqRk6ncP&sz=w800" }
];


// ==========================================
// SELEÇÃO DE ELEMENTOS DO DOM
// ==========================================
const input1 = document.getElementById("restricao1");
const input2 = document.getElementById("restricao2");
const btnAcessar = document.getElementById("btn-acessar");
const msgErro = document.getElementById("mensagem-erro");
const secaoFachada = document.getElementById("fachada");
const secaoGaleria = document.getElementById("galeria");

// ==========================================
// SUPORTE À TECLA ENTER NO LOGIN
// ==========================================
function verificarEnter(event) {
    if (event.key === "Enter") {
        btnAcessar.click();
    }
}
input1.addEventListener("keydown", verificarEnter);
input2.addEventListener("keydown", verificarEnter);

// ==========================================
// GERAÇÃO DINÂMICA DA GALERIA
// ==========================================
function carregarGaleria() {
    galeriaContainer.innerHTML = ""; // Limpa antes de gerar

    cardapio.forEach((item, index) => {
        const divItem = document.createElement("div");
        divItem.classList.add("item-galeria");
        
        // Marcação par/ímpar para as direções alternadas da próxima etapa
        if (index % 2 === 0) {
            divItem.classList.add("item-par");
        } else {
            divItem.classList.add("item-impar");
        }

        divItem.innerHTML = `
            <div class="legenda-etapa">${item.etapa}</div>
            <div class="conjunto-foto">
                <img src="${item.imagem}" alt="${item.titulo}">
                <div class="legenda-foto">${item.titulo}</div>
            </div>
        `;

        galeriaContainer.appendChild(divItem);
    });
    iniciarAnimacoes();
}

// ==========================================
// LÓGICA DO CABEÇALHO ENCOLHENDO (SCROLL)
// ==========================================
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        cabecalho.classList.add("encolhido");
    } else {
        cabecalho.classList.remove("encolhido");
    }
});

// ==========================================
// LÓGICA DE VALIDAÇÃO
// ==========================================
btnAcessar.addEventListener("click", () => {
    // Captura valores, remove espaços e converte para minúsculas
    const r1 = input1.value.trim().toLowerCase();
    const r2 = input2.value.trim().toLowerCase();
    const respostasUsuario = [r1, r2];
    
    // Verifica se as duas respostas corretas estão presentes
    const acertou = respostasCorretas.every(resposta => respostasUsuario.includes(resposta));

    if (acertou) {
        secaoFachada.style.display = "none";
        secaoGaleria.style.display = "block";
        msgErro.style.display = "none";
        
        carregarGaleria(); 
        window.scrollTo(0, 0); 
    } else {
        msgErro.style.display = "block";
        input1.value = "";
        input2.value = "";
        input1.focus();
    }
});

// ==========================================
// ANIMAÇÕES GSAP (SCROLL)
// ==========================================
function iniciarAnimacoes() {
    gsap.registerPlugin(ScrollTrigger);

    const itens = document.querySelectorAll('.item-galeria');

    itens.forEach((item, index) => {
      const textoFundo = item.querySelector('.legenda-etapa');
        const conjuntoFoto = item.querySelector('.conjunto-foto'); // Seleciona apenas a foto e sua legenda
        
        // 100vw garante que a foto inicie 100% invisível/fora da tela
        const direcaoInicial = index % 2 === 0 ? 100 : -100; 

        // 1. Timeline do Texto
        let tlTexto = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top 90%", 
                end: "top 30%",   
                scrub: 0.2 
            }
        });

        tlTexto.fromTo(textoFundo,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, force3D: true } 
        )
        .to(textoFundo, 
            { scale: 1.2, opacity: 1, duration: 2.0, force3D: true } 
        )
        .to(textoFundo,
            { scale: 20, opacity: 0, duration: 0.8, force3D: true } 
        );

        // 2. Timeline da Foto
        // start: foto começa a entrar quando o item aparece na tela
        // end: "top 55px" → topo do item quase tocando o header encolhido (≈55px)
        //      a saída lateral termina só quando chega lá em cima
        let tlFoto = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                end: "top 55px",
                scrub: 0.5 
            }
        });

        // Fase 1 — entrada lateral: foto chega em x:0 quando o centro do item
        //           está próximo ao centro da viewport (≈ 40% da timeline)
        tlFoto.fromTo(conjuntoFoto, 
            { x: `${direcaoInicial}vw`, y: '15vh' }, 
            { x: 0, y: 0, duration: 4.5, ease: "sine.out", force3D: true } 
        )
        // Fase 2 — pausa centralizada: foto fica parada enquanto o usuário ainda rola
        .to(conjuntoFoto, 
            { x: 0, y: 0, duration: 1.0, ease: "none", force3D: true } 
        )
        // Fase 3 — saída lateral: só começa depois da pausa, antes do topo tocar o header
        .to(conjuntoFoto, 
            { x: `${-direcaoInicial}vw`, y: '-15vh', duration: 4.5, ease: "sine.in", force3D: true } 
        );
    });
}

/* ==========================================
   MOTOR GSAP: SHIMMER E ESTRELA DE CRISTAL
=========================================== */
function iniciarBrilhoCristal() {
    // 1. Cria a linha do tempo infinita, com 2 segundos de pausa entre cada repetição
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    // 2. Viagem do Shimmer (Leva 4 segundos com aceleração e desaceleração suave)
    tl.fromTo("#fachada h1, #cabecalho h2", 
        { backgroundPosition: "100% center" },
        { backgroundPosition: "0% center", duration: 4, ease: "power2.inOut" }
    );

    // ==========================================
    // ÁREA DE CALIBRAGEM FINA DA ESTRELA
    // ==========================================
    // O texto leva 4 segundos inteiros para ser percorrido.
    // Altere este número absoluto para cravar a explosão em cima da letra "e".
    // Se estourar cedo demais, aumente (ex: 3.0). Se estourar tarde demais, diminua (ex: 2.6).
    const tempoDaExplosao = 2.2; 

    // 3. O Pulo do Gato: Engatilha a explosão no tempo absoluto ignorando as porcentagens
    tl.to(".estrela-brilho", {
        opacity: 1, 
        scale: 1, 
        rotation: 45, 
        duration: 0.15, // Duração curtíssima (flash rápido)
        ease: "power1.out"
    }, tempoDaExplosao);

    // 4. Morre e encolhe girando logo após a explosão
    tl.to(".estrela-brilho", {
        opacity: 0, 
        scale: 0, 
        rotation: 90, 
        duration: 0.15,
        ease: "power1.in"
    }, tempoDaExplosao + 0.15); // Engatilha imediatamente após a explosão
}

// Inicia a orquestração assim que o site carregar
document.addEventListener("DOMContentLoaded", iniciarBrilhoCristal);

// ==========================================
// CINEMÁTICA DA LOGO GIRATÓRIA
// ==========================================
gsap.to(".logo-giratoria", {
    /* O pulo do gato: o "+=" força o GSAP a respeitar a sua calibração do CSS */
    rotation: "+=1080", 
    ease: "none",   
    scrollTrigger: {
        trigger: "body",      
        start: "top top",     
        end: "bottom bottom", 
        scrub: 1.5            
    }
});
