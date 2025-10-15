<script setup>
import { Head, Link } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'
import { onMounted, ref, watch } from 'vue'

defineOptions({
  layout: AppLayout
})

const mobileMenuActive = ref(false)
const nav = ref(null)
const isDarkMode = ref(false)

// Initialize dark mode from localStorage
const initDarkMode = () => {
  const saved = localStorage.getItem('darkMode')
  isDarkMode.value = saved ? JSON.parse(saved) : false
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode.value))
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

// Watch for changes to apply transitions
watch(isDarkMode, (newValue) => {
  document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease'

  // Update navigation colors immediately when theme changes
  const navElement = nav.value
  if (navElement) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    if (scrollTop > 50) {
      if (newValue) {
        navElement.style.background = 'rgba(15, 15, 35, 0.98)'
        navElement.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
      } else {
        navElement.style.background = 'rgba(255, 255, 255, 0.98)'
        navElement.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }
    } else {
      if (newValue) {
        navElement.style.background = 'rgba(15, 15, 35, 0.95)'
        navElement.style.boxShadow = 'none'
      } else {
        navElement.style.background = 'rgba(255, 255, 255, 0.95)'
        navElement.style.boxShadow = 'none'
      }
    }
  }

  setTimeout(() => {
    document.documentElement.style.transition = ''
  }, 300)
})

const toggleMobileMenu = () => {
  mobileMenuActive.value = !mobileMenuActive.value
}

const smoothScroll = (targetId) => {
  const targetElement = document.getElementById(targetId)
  if (targetElement) {
    const offsetTop = targetElement.offsetTop - 80
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
  }
}

const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div')
  notification.className = `notification notification-${type}`
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#6366f1'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 9999;
    max-width: 300px;
    font-family: inherit;
    font-weight: 500;
  `
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = 'translateX(0)'
  }, 100)

  setTimeout(() => {
    notification.style.transform = 'translateX(100%)'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

const createRippleEffect = (event, button) => {
  const ripple = document.createElement('span')
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  `

  button.style.position = 'relative'
  button.style.overflow = 'hidden'
  button.appendChild(ripple)

  setTimeout(() => ripple.remove(), 600)
}

onMounted(() => {
  // Navigation scroll effect
  let lastScrollTop = 0
  const navElement = nav.value

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const isDark = document.documentElement.classList.contains('dark')

    if (navElement) {
      if (scrollTop > 50) {
        if (isDark) {
          navElement.style.background = 'rgba(15, 15, 35, 0.98)'
          navElement.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
        } else {
          navElement.style.background = 'rgba(255, 255, 255, 0.98)'
          navElement.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }
      } else {
        if (isDark) {
          navElement.style.background = 'rgba(15, 15, 35, 0.95)'
          navElement.style.boxShadow = 'none'
        } else {
          navElement.style.background = 'rgba(255, 255, 255, 0.95)'
          navElement.style.boxShadow = 'none'
        }
      }

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        navElement.style.transform = 'translateY(-100%)'
      } else {
        navElement.style.transform = 'translateY(0)'
      }
    }
    lastScrollTop = scrollTop
  }

  window.addEventListener('scroll', handleScroll)

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'

        if (entry.target.classList.contains('collection-card')) {
          const cards = entry.target.parentElement.children
          Array.from(cards).forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = '1'
              card.style.transform = 'translateY(0)'
            }, index * 100)
          })
        }

        if (entry.target.classList.contains('process-step')) {
          const steps = entry.target.parentElement.children
          Array.from(steps).forEach((step, index) => {
            setTimeout(() => {
              step.style.opacity = '1'
              step.style.transform = 'translateY(0)'
            }, index * 150)
          })
        }
      }
    })
  }, observerOptions)

  const animatedElements = document.querySelectorAll('.collections, .about, .process, .cta')
  animatedElements.forEach(el => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(30px)'
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
    observer.observe(el)
  })

  // Stats counter animation
  const stats = document.querySelectorAll('.stat-number')
  const animateStats = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target
        const finalValue = parseInt(target.textContent)
        const increment = finalValue / 50
        let current = 0

        const updateCounter = () => {
          if (current < finalValue) {
            current += increment
            target.textContent = Math.ceil(current) + (target.textContent.includes('+') ? '+' : '') + (target.textContent.includes('%') ? '%' : '')
            requestAnimationFrame(updateCounter)
          } else {
            target.textContent = target.dataset.originalValue || target.textContent
          }
        }

        if (!target.dataset.originalValue) {
          target.dataset.originalValue = target.textContent
          target.textContent = '0'
          updateCounter()
        }
      }
    })
  }

  const statsObserver = new IntersectionObserver(animateStats, {
    threshold: 0.5
  })

  stats.forEach(stat => {
    statsObserver.observe(stat)
  })

  // Parallax effect
  const handleParallax = () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll('.floating-elements')

    parallaxElements.forEach(element => {
      const speed = 0.5
      element.style.transform = `translateY(${scrolled * speed}px)`
    })
  }

  window.addEventListener('scroll', handleParallax)

  // Enhanced bead animations
  const beads = document.querySelectorAll('.bead')
  beads.forEach((bead, index) => {
    setInterval(() => {
      const randomX = (Math.random() - 0.5) * 10
      const randomY = (Math.random() - 0.5) * 10
      bead.style.transform = `translate(${randomX}px, ${randomY}px)`
    }, 3000 + (index * 500))
  })

  // Konami code easter egg
  let konamiCode = []
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']

  const handleKeydown = (e) => {
    konamiCode.push(e.code)
    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift()
    }

    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
      document.body.style.filter = 'hue-rotate(180deg)'
      showNotification('🎉 Developer mode activated! Nice coding skills!', 'success')

      setTimeout(() => {
        document.body.style.filter = 'none'
      }, 3000)

      konamiCode = []
    }
  }

  document.addEventListener('keydown', handleKeydown)

  console.log('🎨 Pheeya.com loaded with love, code, and craft! 🎵')
  console.log('Built with modern web technologies and artistic passion.')

  // Initialize dark mode
  initDarkMode()

  // Cleanup on unmount
  return () => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('scroll', handleParallax)
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <Head title="Pheeya — Creating at the Intersection of Code, Music & Beads"></Head>

  <!-- Navigation -->
  <nav ref="nav" class="nav fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 transition-all duration-300">
    <div class="nav-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div class="nav-brand flex items-center space-x-3">
          <img src="/images/logo.svg" alt="Pheeya Logo" />
        </div>
        <ul class="nav-menu hidden md:flex space-x-8" :class="{ 'active': mobileMenuActive }">
          <li><a @click="smoothScroll('beads')" href="#beads" class="nav-link text-charcoal hover:text-coral transition-colors cursor-pointer">Beads</a></li>
          <li><a @click="smoothScroll('tech')" href="#tech" class="nav-link text-charcoal hover:text-coral transition-colors cursor-pointer">Tech</a></li>
          <li><a @click="smoothScroll('music')" href="#music" class="nav-link text-charcoal hover:text-coral transition-colors cursor-pointer">Music</a></li>
          <li><a @click="smoothScroll('blog')" href="#blog" class="nav-link text-charcoal hover:text-coral transition-colors cursor-pointer">Blog</a></li>
          <li><Link href="/beaded-by-pheeya" class="nav-link cta-link bg-coral text-white px-6 py-2 rounded-full hover:bg-coral-600 transition-colors">Shop Beads</Link></li>
        </ul>
        <div class="nav-actions flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <button @click="toggleDarkMode" class="theme-toggle w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg dark:hover:shadow-purple-500/50">
            <span v-if="!isDarkMode" class="text-xl">🌙</span>
            <span v-else class="text-xl">☀️</span>
          </button>
          <button @click="toggleMobileMenu" class="mobile-menu-toggle md:hidden flex flex-col space-y-1 transition-all duration-300" :class="{ 'active': mobileMenuActive }">
            <span class="w-6 h-0.5 bg-charcoal transition-all duration-300"></span>
            <span class="w-6 h-0.5 bg-charcoal transition-all duration-300"></span>
            <span class="w-6 h-0.5 bg-charcoal transition-all duration-300"></span>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero pt-20">
    <div class="hero-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="hero-content grid lg:grid-cols-2 gap-12 items-center py-16">
        <div class="hero-text space-y-8">
          <span class="hero-badge inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-coral/10 to-sage/10 text-coral border border-coral/20">
            ✨ Multi-Dimensional Creator
          </span>
          <h1 class="hero-title text-5xl lg:text-7xl font-serif font-bold leading-tight">
            <span class="text-charcoal">Pheeya</span> —<br>
            <span class="gradient-text bg-gradient-to-r from-coral to-sage bg-clip-text text-transparent">Creating at the Intersection</span><br>
            <span class="text-charcoal">of Code, Music & Beads</span>
          </h1>
          <p class="hero-description text-xl text-gray-600 leading-relaxed max-w-lg">
            Software developer by day, musician by passion, and artisan by heart. I create beautiful experiences across three worlds — from elegant code to handcrafted jewelry to soulful melodies.
          </p>
          <div class="hero-actions flex flex-col sm:flex-row gap-4">
            <button @click="(e) => { createRippleEffect(e, e.target); smoothScroll('about') }" class="btn btn-primary bg-coral text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-coral-600 transition-all hover-lift relative overflow-hidden">
              Explore My Work
            </button>
            <Link href="/beaded-by-pheeya" @click="(e) => createRippleEffect(e, e.target)" class="btn btn-secondary border-2 border-sage text-sage px-8 py-3 rounded-full text-lg font-medium hover:bg-sage hover:text-white transition-colors relative overflow-hidden inline-flex items-center justify-center">
              Shop Beads
            </Link>
          </div>
          <div class="hero-stats flex items-center space-x-8 pt-4">
            <div class="stat text-center">
              <span class="stat-number text-2xl font-bold text-charcoal">500+</span>
              <span class="stat-label block text-sm text-gray-600">Unique Pieces</span>
            </div>
            <div class="stat text-center">
              <span class="stat-number text-2xl font-bold text-charcoal">100%</span>
              <span class="stat-label block text-sm text-gray-600">Handmade</span>
            </div>
            <div class="stat text-center">
              <span class="stat-number text-2xl font-bold text-charcoal">50+</span>
              <span class="stat-label block text-sm text-gray-600">Happy Clients</span>
            </div>
          </div>
        </div>
        <div class="hero-visual relative">
          <div class="bead-showcase relative">
            <!-- Animated bead elements -->
            <div class="bead bead-1 absolute w-16 h-16 rounded-full bg-gradient-to-br from-coral to-coral-600 shadow-lg animate-float" style="top: 10%; left: 20%; animation-delay: 0s;"></div>
            <div class="bead bead-2 absolute w-12 h-12 rounded-full bg-gradient-to-br from-sage to-sage-600 shadow-lg animate-float" style="top: 30%; right: 10%; animation-delay: 0.5s;"></div>
            <div class="bead bead-3 absolute w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-xl animate-float" style="bottom: 40%; left: 30%; animation-delay: 1s;"></div>
            <div class="bead bead-4 absolute w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg animate-float" style="bottom: 20%; right: 25%; animation-delay: 1.5s;"></div>
            <div class="bead bead-5 absolute w-18 h-18 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg animate-float" style="top: 60%; left: 50%; animation-delay: 2s;"></div>

            <!-- Floating elements -->
            <div class="floating-elements">
              <div class="code-snippet absolute top-16 right-16 bg-charcoal/90 text-sage px-3 py-2 rounded-lg text-sm font-mono animate-pulse">
                &lt;craft&gt;
              </div>
              <div class="music-note absolute bottom-16 left-16 text-4xl text-coral animate-bounce">♪</div>
              <div class="sparkle sparkle-1 absolute top-32 left-32 text-2xl text-yellow-400 animate-ping">✨</div>
              <div class="sparkle sparkle-2 absolute bottom-32 right-32 text-2xl text-purple-400 animate-pulse">✦</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Beads Section -->
  <section class="beads bg-white py-20" id="beads">
    <div class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="section-header text-center mb-16">
        <h2 class="section-title text-4xl font-bold text-charcoal mb-4">Beaded by Pheeya — Crafted with Love, Worn with Pride</h2>
        <p class="section-description text-xl text-gray-600 max-w-2xl mx-auto">Each piece tells a story, handcrafted with the same precision I bring to my code</p>
      </div>

      <!-- Main Content Grid -->
      <div class="beads-main-grid grid lg:grid-cols-2 gap-12 items-start mb-16">
        <!-- Left: Bead Gallery Grid -->
        <div class="bead-gallery">
          <div class="bead-photos-grid grid grid-cols-3 gap-3">
            <!-- Row 1 -->
            <div class="bead-photo group cursor-pointer hover-lift">
              <div class="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-coral to-pink-400 shadow-lg">
                <div class="w-full h-full flex items-center justify-center relative">
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">Coral Dreams</span>
                </div>
              </div>
            </div>

            <div class="bead-photo group cursor-pointer hover-lift">
              <div class="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-sage to-emerald-400 shadow-lg">
                <div class="w-full h-full flex items-center justify-center relative">
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">Sage Whispers</span>
                </div>
              </div>
            </div>

            <div class="bead-photo group cursor-pointer hover-lift">
              <div class="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg">
                <div class="w-full h-full flex items-center justify-center relative">
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">Golden Hour</span>
                </div>
              </div>
            </div>

            <!-- Row 2 -->
            <div class="bead-photo group cursor-pointer hover-lift">
              <div class="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg">
                <div class="w-full h-full flex items-center justify-center relative">
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">Ocean Blues</span>
                </div>
              </div>
            </div>

            <div class="bead-photo group cursor-pointer hover-lift">
              <div class="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-400 to-violet-500 shadow-lg">
                <div class="w-full h-full flex items-center justify-center relative">
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">Royal Purple</span>
                </div>
              </div>
            </div>

            <div class="bead-photo group cursor-pointer hover-lift">
              <div class="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg">
                <div class="w-full h-full flex items-center justify-center relative">
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">Rose Garden</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Featured Collections -->
        <div class="featured-collections space-y-6">
          <div class="collections-header mb-8">
            <h3 class="text-2xl font-serif font-bold text-charcoal mb-3">Featured Collections</h3>
            <p class="text-gray-600">Each collection inspired by a different aspect of my creative journey</p>
          </div>

          <!-- Featured Collection 1 - Rhythmic Resonance -->
          <div class="collection-card primary-card group hover-lift bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-coral/10 hover:border-coral/20 transition-all duration-300">
            <div class="collection-content grid md:grid-cols-3 gap-0">
              <div class="collection-image md:col-span-1">
                <div class="h-32 md:h-full bg-gradient-to-br from-fuchsia-400 via-pink-400 to-coral flex items-center justify-center relative overflow-hidden">
                  <div class="floating-music-notes absolute inset-0">
                    <div class="music-note absolute top-4 left-4 text-white/60 animate-bounce" style="animation-delay: 0s;">♪</div>
                    <div class="music-note absolute top-8 right-6 text-white/40 animate-bounce" style="animation-delay: 0.5s;">♫</div>
                    <div class="music-note absolute bottom-6 left-6 text-white/50 animate-bounce" style="animation-delay: 1s;">♪</div>
                  </div>
                  <span class="collection-icon text-3xl text-white/80">🎵</span>
                </div>
              </div>
              <div class="collection-info md:col-span-2 p-6">
                <h4 class="collection-title text-xl font-semibold text-charcoal mb-2 group-hover:text-coral transition-colors">Rhythmic Resonance</h4>
                <p class="collection-description text-gray-600 mb-3">Beads inspired by musical frequencies and the rhythm of code compilation</p>
                <div class="collection-footer flex items-center justify-between">
                  <span class="price text-lg font-bold text-coral">From $45</span>
                  <div class="btn-icon w-10 h-10 bg-coral/10 group-hover:bg-coral group-hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1">
                    →
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Featured Collection 2 - Digital Dreams -->
          <div class="collection-card group hover-lift bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-300">
            <div class="collection-content grid md:grid-cols-3 gap-0">
              <div class="collection-image md:col-span-1">
                <div class="h-32 md:h-full bg-gradient-to-br from-blue-400 via-teal-400 to-sage flex items-center justify-center relative overflow-hidden">
                  <div class="code-elements absolute inset-0">
                    <div class="code-bracket absolute top-3 left-3 text-white/60 font-mono text-sm animate-pulse" style="animation-delay: 0s;">&lt;/&gt;</div>
                    <div class="code-bracket absolute top-6 right-4 text-white/40 font-mono text-xs animate-pulse" style="animation-delay: 0.7s;">{}</div>
                    <div class="code-bracket absolute bottom-4 left-4 text-white/50 font-mono text-xs animate-pulse" style="animation-delay: 1.4s;">[]</div>
                  </div>
                  <span class="collection-icon text-3xl text-white/80">💻</span>
                </div>
              </div>
              <div class="collection-info md:col-span-2 p-6">
                <h4 class="collection-title text-xl font-semibold text-charcoal mb-2 group-hover:text-blue-600 transition-colors">Digital Dreams</h4>
                <p class="collection-description text-gray-600 mb-3">Binary patterns translated into tactile art</p>
                <div class="collection-footer flex items-center justify-between">
                  <span class="price text-lg font-bold text-blue-600">From $35</span>
                  <div class="btn-icon w-10 h-10 bg-blue-100 group-hover:bg-blue-600 group-hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1">
                    →
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Featured Collection 3 - Artisan's Algorithm -->
          <div class="collection-card group hover-lift bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:border-amber-200 transition-all duration-300">
            <div class="collection-content grid md:grid-cols-3 gap-0">
              <div class="collection-image md:col-span-1">
                <div class="h-32 md:h-full bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 flex items-center justify-center relative overflow-hidden">
                  <div class="craft-elements absolute inset-0">
                    <div class="sparkle absolute top-4 right-3 text-white/60 animate-ping" style="animation-delay: 0s;">✨</div>
                    <div class="sparkle absolute bottom-5 left-3 text-white/50 animate-ping" style="animation-delay: 1s;">⭐</div>
                    <div class="sparkle absolute top-1/2 right-5 text-white/40 animate-ping" style="animation-delay: 2s;">✦</div>
                  </div>
                  <span class="collection-icon text-3xl text-white/80">🎨</span>
                </div>
              </div>
              <div class="collection-info md:col-span-2 p-6">
                <h4 class="collection-title text-xl font-semibold text-charcoal mb-2 group-hover:text-amber-600 transition-colors">Artisan's Algorithm</h4>
                <p class="collection-description text-gray-600 mb-3">Traditional techniques meet modern precision</p>
                <div class="collection-footer flex items-center justify-between">
                  <span class="price text-lg font-bold text-amber-600">From $55</span>
                  <div class="btn-icon w-10 h-10 bg-amber-100 group-hover:bg-amber-600 group-hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1">
                    →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center">
        <Link href="/beaded-by-pheeya" @click="(e) => createRippleEffect(e, e.target)" class="btn btn-primary bg-coral text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-coral-600 transition-all hover-lift relative overflow-hidden inline-flex items-center justify-center">
          Shop the Collection
        </Link>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section class="about bg-warm-gray py-20" id="about">
    <div class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="about-content grid lg:grid-cols-2 gap-16 items-center">
        <div class="about-text space-y-6">
          <span class="section-badge inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-coral/10 text-coral">About Me</span>
          <h2 class="section-title text-4xl font-bold text-charcoal leading-tight">
            The Intersection of<br>
            <span class="gradient-text bg-gradient-to-r from-coral to-sage bg-clip-text text-transparent">Art & Algorithm</span>
          </h2>
          <p class="about-description text-lg text-gray-700 leading-relaxed">
            I'm a software developer by day, bead artist by passion, and musician by soul.
            My journey into bead crafting began as a way to create something tangible in a world of digital abstractions.
          </p>
          <p class="about-description text-lg text-gray-700 leading-relaxed">
            Each bead is meticulously crafted using techniques I've refined through years of practice,
            with the same attention to detail I bring to writing clean, elegant code.
          </p>
          <div class="skills flex flex-wrap gap-2 pt-4">
            <div class="skill-tag px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal shadow-sm">Handcrafting</div>
            <div class="skill-tag px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal shadow-sm">Software Development</div>
            <div class="skill-tag px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal shadow-sm">Music Production</div>
            <div class="skill-tag px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal shadow-sm">Design</div>
          </div>
        </div>
        <div class="about-visual">
          <div class="profile-card bg-white rounded-2xl p-8 shadow-xl">
            <div class="profile-image mb-6">
              <div class="placeholder-profile w-24 h-24 bg-gradient-to-br from-coral to-sage rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">P</div>
            </div>
            <div class="profile-info text-center">
              <h4 class="text-xl font-bold text-charcoal mb-2">S.Peace (Pheeya Creator)</h4>
              <p class="text-gray-600">Developer • Artist • Musician</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Tech Section -->
  <section class="tech bg-white py-20" id="tech">
    <div class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="section-header text-center mb-16">
        <h2 class="section-title text-4xl font-serif font-bold text-charcoal mb-4">Building with Code</h2>
        <p class="section-description text-xl text-gray-600 max-w-2xl mx-auto">Crafting digital experiences with the same attention to detail as my beadwork</p>
      </div>
      <div class="tech-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Sails.js Contributions -->
        <div class="tech-card group hover-lift bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <div class="tech-image relative">
            <div class="placeholder-image h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <div class="text-white text-center">
                <div class="text-4xl mb-2">⚙️</div>
                <span class="text-lg font-medium">Sails.js</span>
              </div>
            </div>
          </div>
          <div class="tech-content p-6">
            <h3 class="tech-title text-xl font-semibold text-charcoal mb-2">Framework Contributions</h3>
            <p class="tech-description text-gray-600 mb-4">Contributing to the Sails.js ecosystem with plugins, documentation, and community support</p>
            <div class="tech-tags flex flex-wrap gap-2 mb-4">
              <span class="tag bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Node.js</span>
              <span class="tag bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">MVC</span>
              <span class="tag bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">API</span>
            </div>
          </div>
        </div>

        <!-- Projects -->
        <div class="tech-card group hover-lift bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <div class="tech-image relative">
            <div class="placeholder-image h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <div class="text-white text-center">
                <div class="text-4xl mb-2">🚀</div>
                <span class="text-lg font-medium">Projects</span>
              </div>
            </div>
          </div>
          <div class="tech-content p-6">
            <h3 class="tech-title text-xl font-semibold text-charcoal mb-2">Full-Stack Applications</h3>
            <p class="tech-description text-gray-600 mb-4">Building scalable web applications from concept to deployment</p>
            <div class="tech-tags flex flex-wrap gap-2 mb-4">
              <span class="tag bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Vue.js</span>
              <span class="tag bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">PostgreSQL</span>
              <span class="tag bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">AWS</span>
            </div>
          </div>
        </div>

        <!-- Blog Posts -->
        <div class="tech-card group hover-lift bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <div class="tech-image relative">
            <div class="placeholder-image h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <div class="text-white text-center">
                <div class="text-4xl mb-2">✍️</div>
                <span class="text-lg font-medium">Writing</span>
              </div>
            </div>
          </div>
          <div class="tech-content p-6">
            <h3 class="tech-title text-xl font-semibold text-charcoal mb-2">Technical Writing</h3>
            <p class="tech-description text-gray-600 mb-4">Sharing knowledge through tutorials, guides, and technical insights</p>
            <div class="tech-tags flex flex-wrap gap-2 mb-4">
              <span class="tag bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">JavaScript</span>
              <span class="tag bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Architecture</span>
              <span class="tag bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">DevOps</span>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-12">
        <button @click="(e) => { createRippleEffect(e, e.target); showNotification('Tech portfolio coming soon! Follow my GitHub for updates.', 'info') }" class="btn btn-primary bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-4 rounded-full text-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all hover-lift relative overflow-hidden">
          View Projects
        </button>
      </div>
    </div>
  </section>

  <!-- Music Section -->
  <section class="music bg-gradient-to-br from-purple-50 to-pink-50 py-20" id="music">
    <div class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="music-content grid lg:grid-cols-2 gap-16 items-center">
        <div class="music-visual relative">
          <!-- Waveform Placeholder -->
          <div class="waveform-container relative h-80 bg-gradient-to-r from-purple-400 via-pink-400 to-coral rounded-3xl shadow-xl opacity-90 flex items-center justify-center">
            <div class="waveform flex items-end space-x-1 h-32">
              <!-- Animated waveform bars -->
              <div class="waveform-bar bg-white/80 w-2 h-8 rounded-full animate-pulse" style="animation-delay: 0s;"></div>
              <div class="waveform-bar bg-white/80 w-2 h-16 rounded-full animate-pulse" style="animation-delay: 0.1s;"></div>
              <div class="waveform-bar bg-white/80 w-2 h-12 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
              <div class="waveform-bar bg-white/80 w-2 h-20 rounded-full animate-pulse" style="animation-delay: 0.3s;"></div>
              <div class="waveform-bar bg-white/80 w-2 h-6 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
              <div class="waveform-bar bg-white/80 w-2 h-14 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
              <div class="waveform-bar bg-white/80 w-2 h-24 rounded-full animate-pulse" style="animation-delay: 0.6s;"></div>
              <div class="waveform-bar bg-white/80 w-2 h-10 rounded-full animate-pulse" style="animation-delay: 0.7s;"></div>
              <div class="waveform-bar bg-white/80 w-2 h-18 rounded-full animate-pulse" style="animation-delay: 0.8s;"></div>
              <div class="waveform-bar bg-white/80 w-2 h-8 rounded-full animate-pulse" style="animation-delay: 0.9s;"></div>
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-white text-lg font-medium bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">Musical Creations</span>
            </div>
          </div>
          <!-- Performance photo placeholder -->
          <div class="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-coral to-sage rounded-full shadow-xl opacity-90 flex items-center justify-center">
            <span class="text-white text-2xl">🎸</span>
          </div>
        </div>

        <div class="music-text space-y-6">
          <div>
            <span class="section-badge inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">Music & Soul</span>
            <h2 class="section-title text-4xl font-serif font-bold text-charcoal mt-4 mb-4">Melodies from the Heart</h2>
          </div>
          <p class="music-description text-lg text-gray-700 leading-relaxed">
            Music is where my soul finds its voice. From acoustic guitar sessions to digital compositions, I create melodies that resonate with life's moments — both joyful and contemplative.
          </p>
          <p class="music-description text-lg text-gray-700 leading-relaxed">
            Each song carries the same intentionality I bring to my code and the same care I put into every handcrafted bead. It's all connected — rhythm, pattern, and beauty.
          </p>
          <div class="music-genres flex flex-wrap gap-2 pt-4">
            <div class="genre-tag px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal shadow-sm border border-purple-200">Acoustic</div>
            <div class="genre-tag px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal shadow-sm border border-purple-200">Gospel</div>
            <div class="genre-tag px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal shadow-sm border border-purple-200">Rap</div>
            <div class="genre-tag px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal shadow-sm border border-purple-200">Worship</div>
          </div>
          <div class="music-cta pt-6">
            <button @click="(e) => { createRippleEffect(e, e.target); showNotification('Music streaming links coming soon! Stay tuned for soulful sounds.', 'info') }" class="btn btn-primary bg-gradient-to-r from-purple-500 to-pink-600 text-white px-10 py-4 rounded-full text-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all hover-lift relative overflow-hidden">
              Listen Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Blog Section -->
  <section class="blog bg-white py-20" id="blog">
    <div class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="section-header text-center mb-16">
        <h2 class="section-title text-4xl font-serif font-bold text-charcoal mb-4">Insights, Faith & Creativity</h2>
        <p class="section-description text-xl text-gray-600 max-w-2xl mx-auto">Thoughts from the intersection of technology, artistry, and life</p>
      </div>
      <div class="blog-grid grid md:grid-cols-3 gap-8">
        <!-- Blog Post 1 -->
        <article class="blog-card group hover-lift bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-yellow-300">
          <div class="blog-image relative">
            <div class="placeholder-image h-48 bg-gradient-to-br from-coral to-orange-400 flex items-center justify-center">
              <div class="text-white text-center">
                <div class="text-3xl mb-2">✍️</div>
                <span class="text-sm">Featured Post</span>
              </div>
            </div>
          </div>
          <div class="blog-content p-6">
            <div class="blog-meta flex items-center text-sm text-gray-500 mb-3">
              <span>Dec 15, 2024</span>
              <span class="mx-2">•</span>
              <span>5 min read</span>
            </div>
            <h3 class="blog-title text-xl font-semibold text-charcoal mb-3 group-hover:text-coral transition-colors">The Art of Debugging: Lessons from Beadwork</h3>
            <p class="blog-excerpt text-gray-600 mb-4 leading-relaxed">How the patience required for intricate beadwork has transformed my approach to solving complex code problems...</p>
            <div class="blog-tags flex flex-wrap gap-2">
              <span class="tag bg-coral-100 text-coral-800 px-2 py-1 rounded-full text-xs">Tech</span>
              <span class="tag bg-sage-100 text-sage-800 px-2 py-1 rounded-full text-xs">Craft</span>
            </div>
          </div>
        </article>

        <!-- Blog Post 2 -->
        <article class="blog-card group hover-lift bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-yellow-300">
          <div class="blog-image relative">
            <div class="placeholder-image h-48 bg-gradient-to-br from-sage to-teal-400 flex items-center justify-center">
              <div class="text-white text-center">
                <div class="text-3xl mb-2">🙏</div>
                <span class="text-sm">Faith & Work</span>
              </div>
            </div>
          </div>
          <div class="blog-content p-6">
            <div class="blog-meta flex items-center text-sm text-gray-500 mb-3">
              <span>Dec 08, 2024</span>
              <span class="mx-2">•</span>
              <span>3 min read</span>
            </div>
            <h3 class="blog-title text-xl font-semibold text-charcoal mb-3 group-hover:text-coral transition-colors">Creating with Purpose: Faith in Daily Work</h3>
            <p class="blog-excerpt text-gray-600 mb-4 leading-relaxed">Exploring how faith infuses meaning into every line of code, every bead, and every melody I create...</p>
            <div class="blog-tags flex flex-wrap gap-2">
              <span class="tag bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Faith</span>
              <span class="tag bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Purpose</span>
            </div>
          </div>
        </article>

        <!-- Blog Post 3 -->
        <article class="blog-card group hover-lift bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-yellow-300">
          <div class="blog-image relative">
            <div class="placeholder-image h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <div class="text-white text-center">
                <div class="text-3xl mb-2">🎵</div>
                <span class="text-sm">Music & Code</span>
              </div>
            </div>
          </div>
          <div class="blog-content p-6">
            <div class="blog-meta flex items-center text-sm text-gray-500 mb-3">
              <span>Nov 29, 2024</span>
              <span class="mx-2">•</span>
              <span>7 min read</span>
            </div>
            <h3 class="blog-title text-xl font-semibold text-charcoal mb-3 group-hover:text-coral transition-colors">Rhythm in Code: Musical Patterns in Programming</h3>
            <p class="blog-excerpt text-gray-600 mb-4 leading-relaxed">Discovering the surprising parallels between musical composition and clean code architecture...</p>
            <div class="blog-tags flex flex-wrap gap-2">
              <span class="tag bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">Music</span>
              <span class="tag bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">Code</span>
            </div>
          </div>
        </article>
      </div>

      <div class="text-center mt-12">
        <button @click="(e) => { createRippleEffect(e, e.target); showNotification('Blog coming soon! Subscribe to be notified when I start sharing insights.', 'info') }" class="btn btn-primary bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-10 py-4 rounded-full text-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all hover-lift relative overflow-hidden">
          Read All Posts
        </button>
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section class="testimonials bg-gradient-to-br from-gray-50 to-blue-50 py-20">
    <div class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="section-header text-center mb-16">
        <h2 class="section-title text-4xl font-serif font-bold text-charcoal mb-4">What People Say</h2>
        <p class="section-description text-xl text-gray-600 max-w-2xl mx-auto">Words from clients, collaborators, and listeners across my three worlds</p>
      </div>
      <div class="testimonials-grid grid md:grid-cols-3 gap-8">
        <!-- Jewelry Testimonial -->
        <div class="testimonial-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div class="testimonial-content">
            <div class="quote-icon text-4xl text-coral mb-4">“</div>
            <p class="testimonial-text text-gray-700 leading-relaxed mb-6">
              Sophia's beads are absolutely stunning! Each piece is crafted with such attention to detail. I get compliments every time I wear them.
            </p>
            <div class="testimonial-author flex items-center">
              <div class="author-avatar w-12 h-12 bg-gradient-to-br from-coral to-pink-400 rounded-full flex items-center justify-center text-white font-bold mr-4">M</div>
              <div>
                <div class="author-name font-semibold text-charcoal">Maria Chen</div>
                <div class="author-role text-sm text-gray-500">Jewelry Client</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tech Testimonial -->
        <div class="testimonial-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div class="testimonial-content">
            <div class="quote-icon text-4xl text-blue-500 mb-4">“</div>
            <p class="testimonial-text text-gray-700 leading-relaxed mb-6">
              Working with Sophia is a dream. Her code is clean, her communication is clear, and she brings creative solutions to complex problems.
            </p>
            <div class="testimonial-author flex items-center">
              <div class="author-avatar w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-4">J</div>
              <div>
                <div class="author-name font-semibold text-charcoal">James Wilson</div>
                <div class="author-role text-sm text-gray-500">Tech Lead</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Music Testimonial -->
        <div class="testimonial-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div class="testimonial-content">
            <div class="quote-icon text-4xl text-purple-500 mb-4">“</div>
            <p class="testimonial-text text-gray-700 leading-relaxed mb-6">
              Sophia's music touches the soul. Her acoustic sessions bring such peace and her compositions tell beautiful stories.
            </p>
            <div class="testimonial-author flex items-center">
              <div class="author-avatar w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">R</div>
              <div>
                <div class="author-name font-semibold text-charcoal">Rachel Thompson</div>
                <div class="author-role text-sm text-gray-500">Music Listener</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta bg-gradient-to-br from-charcoal to-gray-800 py-20">
    <div class="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="cta-content space-y-8">
        <h2 class="cta-title text-4xl font-serif font-bold text-white">Let's Create Something Beautiful Together</h2>
        <p class="cta-description text-xl text-gray-300 max-w-2xl mx-auto">Whether you need handcrafted jewelry, technical expertise, or musical collaboration — I'd love to work with you.</p>
        <div class="cta-actions flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/beaded-by-pheeya" @click="(e) => createRippleEffect(e, e.target)" class="btn btn-primary btn-large bg-coral text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-coral-600 transition-all hover-lift relative overflow-hidden inline-flex items-center justify-center">Shop Beads</Link>
          <button @click="(e) => { createRippleEffect(e, e.target); showNotification('Connect with me at hello@pheeya.com for collaborations!', 'success') }" class="btn btn-secondary btn-large border-2 border-sage text-sage px-10 py-4 rounded-full text-lg font-medium hover:bg-sage hover:text-white transition-colors relative overflow-hidden">Let's Collaborate</button>
        </div>
      </div>
    </div>
  </section>
</template>
