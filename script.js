/**
 * Para membuat link bisa dicopy
 */
const actionLink = document.querySelectorAll(".link-card .link-action")

actionLink.forEach((action) => {
  action.addEventListener("click", (e) => {
    e.preventDefault()
    navigator.clipboard.writeText(action.parentElement.getAttribute("href"))

    /**
     * Untuk memunculkan toast notification
     */
    document.getElementById("toast").innerHTML = `
        <div class="toast-container">
            <p>✅ Link do <strong> ${action.parentElement.innerText} </strong> copiado!</p>
        </div>
    `

    /**
     * Untuk menghilangkan toast notification
     */

    setTimeout(() => {
      document.querySelector("#toast .toast-container").classList.add("toast-gone")
    }, 300)

    setTimeout(() => {
      document.querySelector("#toast .toast-container").remove()
    }, 2000)
  })
})

/**
 * Untuk ganti icon sosmed saat hover
 */

document.querySelectorAll(".sosmed i").forEach((sosmed) => {
  sosmed.addEventListener("mouseenter", () => {
    sosmed.classList.remove("ph")
    sosmed.classList.add("ph-fill")
  })

  sosmed.addEventListener("mouseleave", () => {
    sosmed.classList.remove("ph-fill")
    sosmed.classList.add("ph")
  })
})

/**
 * Animasi Text bergerak saat scroll
 */

document.addEventListener("scroll", (e) => {
  document.querySelector(".bg-text-animation").style.transform = `translateX(${window.scrollY / 5}px)`
})

/**
 * CONFIGURAÇÃO DOS CARROSSÉIS
 * Para adicionar mais imagens, basta adicionar objetos no array correspondente
 * Cada objeto precisa ter: src (caminho da imagem) e link (URL para onde o botão vai levar)
 */

const carouselData = {
  "carousel-catamara": [
    { src: "./public/catamara1.png", link: "https://api.whatsapp.com/send/?phone=5583994086376" },
    { src: "./public/catamara1.jpeg", link: "https://api.whatsapp.com/send/?phone=5583994086376" },
    { src: "./public/catamara1.jpeg", link: "https://api.whatsapp.com/send/?phone=5583994086376" },
  ],
  "carousel-lanchas-passeios": [
    { src: "./public/catamara1.jpeg", link: "https://api.whatsapp.com/send/?phone=5583994086376" },
    { src: "./public/catamara1.jpeg", link: "https://api.whatsapp.com/send/?phone=5583994086376" },
    { src: "./public/catamara1.jpeg", link: "https://api.whatsapp.com/send/?phone=5583994086376" },
  ],
  "carousel-embarcacoes": [
    { src: "./public/catamara1.jpeg", link: "https://api.whatsapp.com/send/?phone=5583994086376" },
    { src: "./public/catamara1.jpeg", link: "https://api.whatsapp.com/send/?phone=5583994086376" },
    { src: "./public/catamara1.jpeg", link: "https://api.whatsapp.com/send/?phone=5583994086376" },
  ],
  "carousel-lanchas": [
    { src: "./public/catamara1.jpeg", link: "https://api.whatsapp.com/send/?phone=5583994086376" },
    { src: "./public/catamara1.jpeg", link: "https://api.whatsapp.com/send/?phone=5583994086376" },
    { src: "./public/catamara1.jpeg", link: "https://api.whatsapp.com/send/?phone=5583994086376" },
  ],
}

/**
 * Classe para gerenciar cada carrossel individualmente
 */
class Carousel {
  constructor(carouselId, images) {
    this.carouselId = carouselId
    this.images = images
    this.currentIndex = 0
    this.autoPlayInterval = null
    this.isPlaying = true

    this.carousel = document.getElementById(carouselId)
    this.track = this.carousel.querySelector(".carousel-track")
    this.dotsContainer = this.carousel.querySelector(".carousel-dots")
    this.prevBtn = this.carousel.querySelector(".carousel-btn-prev")
    this.nextBtn = this.carousel.querySelector(".carousel-btn-next")

    this.init()
  }

  /**
   * Inicializa o carrossel
   */
  init() {
    this.renderImages()
    this.renderDots()
    this.attachEventListeners()
    this.startAutoPlay()
  }

  /**
   * Renderiza as imagens no carrossel
   */
  renderImages() {
    this.track.innerHTML = ""
    this.images.forEach((image, index) => {
      const item = document.createElement("div")
      item.className = "carousel-item"
      item.innerHTML = `<img src="${image.src}" alt="Imagem ${index + 1}" loading="lazy">`
      item.dataset.index = index
      item.dataset.link = image.link
      this.track.appendChild(item)
    })
  }

  /**
   * Renderiza os dots de navegação
   */
  renderDots() {
    this.dotsContainer.innerHTML = ""
    this.images.forEach((_, index) => {
      const dot = document.createElement("div")
      dot.className = `carousel-dot ${index === 0 ? "active" : ""}`
      dot.dataset.index = index
      this.dotsContainer.appendChild(dot)
    })
  }

  /**
   * Adiciona event listeners
   */
  attachEventListeners() {
    // Botões de navegação
    this.prevBtn.addEventListener("click", () => this.prev())
    this.nextBtn.addEventListener("click", () => this.next())

    // Dots de navegação
    this.dotsContainer.querySelectorAll(".carousel-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = Number.parseInt(dot.dataset.index)
        this.goToSlide(index)
      })
    })

    // Click nas imagens para abrir modal
    this.track.querySelectorAll(".carousel-item").forEach((item) => {
      item.addEventListener("click", () => {
        const index = Number.parseInt(item.dataset.index)
        const link = item.dataset.link
        this.openModal(this.images[index].src, link)
      })
    })
  }

  /**
   * Vai para o slide anterior
   */
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
    this.updateCarousel()
  }

  /**
   * Vai para o próximo slide
   */
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length
    this.updateCarousel()
  }

  /**
   * Vai para um slide específico
   */
  goToSlide(index) {
    this.currentIndex = index
    this.updateCarousel()
  }

  /**
   * Atualiza a posição do carrossel
   */
  updateCarousel() {
    const offset = -this.currentIndex * 100
    this.track.style.transform = `translateX(${offset}%)`

    // Atualiza dots
    this.dotsContainer.querySelectorAll(".carousel-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex)
    })
  }

  /**
   * Inicia o autoplay
   */
  startAutoPlay() {
    this.stopAutoPlay() // Limpa qualquer intervalo existente
    this.autoPlayInterval = setInterval(() => {
      if (this.isPlaying) {
        this.next()
      }
    }, 4000) // Muda a cada 4 segundos (devagar)
  }

  /**
   * Para o autoplay
   */
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
      this.autoPlayInterval = null
    }
  }

  /**
   * Pausa o carrossel
   */
  pause() {
    this.isPlaying = false
  }

  /**
   * Resume o carrossel
   */
  resume() {
    this.isPlaying = true
  }

  /**
   * Abre o modal com a imagem
   */
  openModal(imageSrc, link) {
    this.pause()
    const modal = document.getElementById("carouselModal")
    const modalImg = modal.querySelector(".carousel-modal-img")
    const modalBtn = modal.querySelector(".carousel-modal-btn")

    modalImg.src = imageSrc
    modalBtn.onclick = () => window.open(link, "_blank")

    modal.classList.add("active")
  }
}

/**
 * Gerenciador do modal
 */
const modal = document.getElementById("carouselModal")

// Fecha o modal ao clicar fora da imagem
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active")
    // Resume todos os carrosséis
    carousels.forEach((carousel) => carousel.resume())
  }
})

/**
 * Inicializa todos os carrosséis
 */
const carousels = []

Object.keys(carouselData).forEach((carouselId) => {
  const carousel = new Carousel(carouselId, carouselData[carouselId])
  carousels.push(carousel)
})

/**
 * Para adicionar mais imagens em qualquer carrossel:
 *
 * 1. Vá até o objeto 'carouselData' no início deste código
 * 2. Encontre o carrossel desejado (ex: 'carousel-catamara')
 * 3. Adicione um novo objeto no array com src e link:
 *
 * Exemplo:
 * 'carousel-catamara': [
 *   { src: './img/catamara1.jpg', link: 'https://seulink.com' },
 *   { src: './img/catamara2.jpg', link: 'https://seulink.com' },
 *   { src: './img/catamara3.jpg', link: 'https://seulink.com' },
 *   { src: './img/catamara4.jpg', link: 'https://seulink.com' }, // <- Nova imagem
 * ]
 *
 * O carrossel vai se ajustar automaticamente!
 */
