function novoElemento(tagName,className){
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barreira(reverse = false){
    this.element = novoElemento('div','barreira')
    const borda = novoElemento('div','borda')
    const corpo = novoElemento('div','corpo')
    this.element.appendChild(reverse ? corpo : borda)
    this.element.appendChild(reverse ? borda : corpo)
    this.setAltura = altura => corpo.style.height = `${altura}px`


}

function ParDeBarreira(altura, abertura, x){
    this.element = novoElemento('div','par-de-barreira')
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)
    this.element.appendChild(this.superior.element)
    this.element.appendChild(this.inferior.element)

    this.randomSpace = () => {
        const alturaSuperior = (Math.random()* (altura - abertura))
        const alturaInferior = altura - abertura -alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getLargura = () => this.element.clientWidth

    this.randomSpace()
    this.setX(x)
}

function Barreiras(altura,largura,abertura,espaco,notificarPonto){
    this.pares = [
        new ParDeBarreira(altura,abertura,largura),
        new ParDeBarreira(altura,abertura,largura+espaco),
        new ParDeBarreira(altura,abertura,largura+espaco*2),
        new ParDeBarreira(altura,abertura,largura+espaco*3),
    ]
    const deslocamento = 3
    this.animar = () =>{
        this.pares.forEach(par =>{
            par.setX(par.getX() - deslocamento)
            //elemento saindo da área do jogo
            if (par.getX()< -par.getLargura()){
                par.setX(par.getX() + espaco * this.pares.length)
                par.randomSpace()
            }
            const meio = largura/2
            const cruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio
            cruzouMeio && notificarPonto()
        })
    }

}

function Bird(alturaJogo){
    let voando = false
    this.element = novoElemento('img', 'bird')
    this.element.src= 'imgs/passaro.png'
    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`
    window.onkeydown = e => {
        voando = true
        if (e.code === 'Space') {
            e.preventDefault()
        }
    }
    window.onkeyup = e => voando = false
    this.animar = () =>{
        const novoY = this.getY() + (voando? 8 : -5)
        const alturaMaxima = alturaJogo - this.element.clientHeight
        if (novoY <= 0){
            this.setY(0)
        } else if (novoY >= alturaMaxima){
            this.setY(alturaMaxima)
        }
        else {
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo/2)
}


function Progresso(){
    this.element = novoElemento('span', 'progresso')
    this.atualizaPontos = pontos => {
        this.element.innerHTML = pontos
    }
    this.atualizaPontos(0)
}

function estaoSobrepostos(elementA, elementB){
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()
    const horizontal = a.left+a.width >= b.left
    && b.left + b.width >= a.left
    const vertical = a.top+a.height >= b.top
    && b.top + b.height >= a.top
    return horizontal && vertical
}

function colidiu(bird,barreiras){
    let colidiu = false
    barreiras.pares.forEach(ParDeBarreira =>{
        if (!colidiu){
            const superior = ParDeBarreira.superior.element
            const inferior = ParDeBarreira.inferior.element
            colidiu = estaoSobrepostos(bird.element,superior)||
            estaoSobrepostos(bird.element,inferior)    
        }
    })
    return colidiu
}

function Main(){
    let pontos = 0
    const Jogo = document.querySelector('[wm-flappy]')
    const altura = Jogo.clientHeight
    const largura = Jogo.clientWidth
    const progresso = new Progresso()
    const barreiras = new Barreiras(altura,largura,200,400,()=>progresso.atualizaPontos(++pontos))
    const bird = new Bird(altura)
    Jogo.appendChild(progresso.element)
    barreiras.pares.forEach(par => Jogo.appendChild(par.element))
    Jogo.appendChild(bird.element)
    
    this.start = () =>{
        //loop do jogo
        const temporizador = setInterval(()=>{
            barreiras.animar()
            bird.animar()
            if (colidiu(bird,barreiras)){
                clearInterval(temporizador)
            }
        },20)
    }
}


new Main().start()

const btnTheme = document.getElementById('toggle-theme');
const htmlElement = document.documentElement;

btnTheme.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'white');
        btnTheme.innerHTML = 'Mudar para Dark Mode 🌙';
        btnTheme.style.background = '#ffca28';
        btnTheme.style.color = '#1a1a1a';
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        btnTheme.innerHTML = 'Mudar para White Mode ☀️';
        btnTheme.style.background = '#ffffff';
        btnTheme.style.color = '#1a1a1a';
    }
});