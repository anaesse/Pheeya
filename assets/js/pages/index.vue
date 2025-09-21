<script setup>
import { Head, Link } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'
import { onMounted, ref } from 'vue'

defineOptions({
  layout: AppLayout
})

const mobileMenuActive = ref(false)
const nav = ref(null)

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
    
    if (navElement) {
      if (scrollTop > 50) {
        navElement.style.background = 'rgba(255, 255, 255, 0.98)'
        navElement.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      } else {
        navElement.style.background = 'rgba(255, 255, 255, 0.95)'
        navElement.style.boxShadow = 'none'
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
  
  // Cleanup on unmount
  return () => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('scroll', handleParallax)
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <Head title="Pheeya - Handcrafted Beads & Digital Artistry"></Head>

  <!-- Navigation -->
  <nav ref="nav" class="nav fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 transition-all duration-300">
    <div class="nav-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div class="nav-brand flex items-center space-x-3">
          <h1 class="logo text-2xl font-bold bg-gradient-to-r from-coral to-sage bg-clip-text text-transparent">Pheeya</h1>
          <span class="tagline text-sm text-gray-500 hidden sm:block font-medium tracking-wide uppercase">Crafted with Code & Soul</span>
        </div>
        <ul class="nav-menu hidden md:flex space-x-8" :class="{ 'active': mobileMenuActive }">
          <li><a @click="smoothScroll('collections')" href="#collections" class="nav-link text-charcoal hover:text-coral transition-colors cursor-pointer">Collections</a></li>
          <li><a @click="smoothScroll('about')" href="#about" class="nav-link text-charcoal hover:text-coral transition-colors cursor-pointer">About</a></li>
          <li><a @click="smoothScroll('process')" href="#process" class="nav-link text-charcoal hover:text-coral transition-colors cursor-pointer">Process</a></li>
          <li><Link href="/login" class="nav-link text-charcoal hover:text-coral transition-colors">Login</Link></li>
          <li><Link href="/signup" class="nav-link cta-link bg-coral text-white px-6 py-2 rounded-full hover:bg-coral-600 transition-colors">Shop</Link></li>
        </ul>
        <button @click="toggleMobileMenu" class="mobile-menu-toggle md:hidden flex flex-col space-y-1 transition-all duration-300" :class="{ 'active': mobileMenuActive }">
          <span class="w-6 h-0.5 bg-charcoal transition-all duration-300"></span>
          <span class="w-6 h-0.5 bg-charcoal transition-all duration-300"></span>
          <span class="w-6 h-0.5 bg-charcoal transition-all duration-300"></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero pt-20">
    <div class="hero-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="hero-content grid lg:grid-cols-2 gap-12 items-center py-16">
        <div class="hero-text space-y-8">
          <span class="hero-badge inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-coral/10 to-sage/10 text-coral border border-coral/20">
            ✨ Handcrafted Excellence
          </span>
          <h1 class="hero-title text-5xl lg:text-7xl font-bold leading-tight">
            Where <span class="gradient-text bg-gradient-to-r from-coral to-sage bg-clip-text text-transparent">Code Meets</span><br>
            <span class="craft-text text-charcoal">Craft</span>
          </h1>
          <p class="hero-description text-xl text-gray-600 leading-relaxed max-w-lg">
            Personal beads crafted with the precision of a developer and the soul of a musician. 
            Each piece tells a story of digital artistry meeting ancient craft.
          </p>
          <div class="hero-actions flex flex-col sm:flex-row gap-4">
            <button @click="(e) => { createRippleEffect(e, e.target); smoothScroll('collections') }" class="btn btn-primary bg-coral text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-coral-600 transition-all hover-lift relative overflow-hidden">
              Explore Collections
            </button>
            <button @click="(e) => { createRippleEffect(e, e.target); showNotification('Coming soon! Watch this space for behind-the-scenes content.', 'info') }" class="btn btn-secondary border-2 border-sage text-sage px-8 py-3 rounded-full text-lg font-medium hover:bg-sage hover:text-white transition-colors flex items-center gap-2 relative overflow-hidden">
              <span class="play-icon">▶</span>
              Watch Process
            </button>
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

  <!-- Featured Collections -->
  <section class="collections bg-white py-20" id="collections">
    <div class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="section-header text-center mb-16">
        <h2 class="section-title text-4xl font-bold text-charcoal mb-4">Featured Collections</h2>
        <p class="section-description text-xl text-gray-600 max-w-2xl mx-auto">Each collection inspired by a different aspect of my creative journey</p>
      </div>
      <div class="collections-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Primary Card -->
        <div class="collection-card primary-card group hover-lift bg-white rounded-2xl overflow-hidden shadow-lg">
          <div class="card-image relative">
            <div class="placeholder-image gradient-bg-1 h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-coral flex items-center justify-center">
              <div class="image-overlay">
                <span class="collection-icon text-4xl">🎵</span>
              </div>
            </div>
          </div>
          <div class="card-content p-6">
            <h3 class="card-title text-xl font-semibold text-charcoal mb-2">Rhythmic Resonance</h3>
            <p class="card-description text-gray-600 mb-4">Beads inspired by musical frequencies and the rhythm of code compilation</p>
            <div class="card-footer flex items-center justify-between">
              <span class="price text-lg font-bold text-coral">From $45</span>
              <button class="btn-icon w-10 h-10 bg-coral/10 hover:bg-coral hover:text-white rounded-full flex items-center justify-center transition-colors">→</button>
            </div>
          </div>
        </div>
        
        <!-- Card 2 -->
        <div class="collection-card group hover-lift bg-white rounded-2xl overflow-hidden shadow-lg">
          <div class="card-image relative">
            <div class="placeholder-image gradient-bg-2 h-64 bg-gradient-to-br from-blue-400 via-teal-400 to-sage flex items-center justify-center">
              <div class="image-overlay">
                <span class="collection-icon text-4xl">💻</span>
              </div>
            </div>
          </div>
          <div class="card-content p-6">
            <h3 class="card-title text-xl font-semibold text-charcoal mb-2">Digital Dreams</h3>
            <p class="card-description text-gray-600 mb-4">Binary patterns translated into tactile art</p>
            <div class="card-footer flex items-center justify-between">
              <span class="price text-lg font-bold text-coral">From $35</span>
              <button class="btn-icon w-10 h-10 bg-coral/10 hover:bg-coral hover:text-white rounded-full flex items-center justify-center transition-colors">→</button>
            </div>
          </div>
        </div>
        
        <!-- Card 3 -->
        <div class="collection-card group hover-lift bg-white rounded-2xl overflow-hidden shadow-lg">
          <div class="card-image relative">
            <div class="placeholder-image gradient-bg-3 h-64 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center">
              <div class="image-overlay">
                <span class="collection-icon text-4xl">🎨</span>
              </div>
            </div>
          </div>
          <div class="card-content p-6">
            <h3 class="card-title text-xl font-semibold text-charcoal mb-2">Artisan's Algorithm</h3>
            <p class="card-description text-gray-600 mb-4">Traditional techniques meet modern precision</p>
            <div class="card-footer flex items-center justify-between">
              <span class="price text-lg font-bold text-coral">From $55</span>
              <button class="btn-icon w-10 h-10 bg-coral/10 hover:bg-coral hover:text-white rounded-full flex items-center justify-center transition-colors">→</button>
            </div>
          </div>
        </div>
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
              <h4 class="text-xl font-bold text-charcoal mb-2">Koo (Pheeya Creator)</h4>
              <p class="text-gray-600">Developer • Artist • Musician</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Process Section -->
  <section class="process bg-white py-20" id="process">
    <div class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="section-header text-center mb-16">
        <h2 class="section-title text-4xl font-bold text-charcoal mb-4">The Creative Process</h2>
        <p class="section-description text-xl text-gray-600 max-w-2xl mx-auto">From concept to completion, every bead follows a journey of precision and passion</p>
      </div>
      <div class="process-steps grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="process-step text-center space-y-4">
          <div class="step-number w-16 h-16 bg-coral rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">01</div>
          <div class="step-content">
            <h3 class="text-xl font-semibold text-charcoal mb-2">Design & Inspiration</h3>
            <p class="text-gray-600">Drawing from music, code patterns, and natural forms to create unique designs</p>
          </div>
        </div>
        <div class="process-step text-center space-y-4">
          <div class="step-number w-16 h-16 bg-sage rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">02</div>
          <div class="step-content">
            <h3 class="text-xl font-semibold text-charcoal mb-2">Material Selection</h3>
            <p class="text-gray-600">Carefully choosing premium materials that resonate with the intended aesthetic</p>
          </div>
        </div>
        <div class="process-step text-center space-y-4">
          <div class="step-number w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">03</div>
          <div class="step-content">
            <h3 class="text-xl font-semibold text-charcoal mb-2">Crafting</h3>
            <p class="text-gray-600">Hand-shaping each bead with tools and techniques refined over years of practice</p>
          </div>
        </div>
        <div class="process-step text-center space-y-4">
          <div class="step-number w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">04</div>
          <div class="step-content">
            <h3 class="text-xl font-semibold text-charcoal mb-2">Quality Assurance</h3>
            <p class="text-gray-600">Testing and refining with the same rigor I apply to debugging code</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta bg-gradient-to-r from-coral/5 to-sage/5 py-20">
    <div class="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="cta-content space-y-8">
        <h2 class="cta-title text-4xl font-bold text-charcoal">Ready to Own a Piece of Digital Craft?</h2>
        <p class="cta-description text-xl text-gray-600 max-w-2xl mx-auto">Join a community of creators who appreciate the fusion of technology and traditional artistry</p>
        <div class="cta-actions flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="(e) => { createRippleEffect(e, e.target); smoothScroll('collections') }" class="btn btn-primary btn-large bg-coral text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-coral-600 transition-all hover-lift relative overflow-hidden">Browse Collections</button>
          <button @click="(e) => { createRippleEffect(e, e.target); showNotification('Interested in a custom piece? Email hello@pheeya.com to get started!', 'success') }" class="btn btn-secondary btn-large border-2 border-sage text-sage px-10 py-4 rounded-full text-lg font-medium hover:bg-sage hover:text-white transition-colors relative overflow-hidden">Commission a Piece</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* CSS Variables */
:root {
  --color-primary: #FF6B6B;
  --color-secondary: #95D5B2;
  --color-accent: #ec4899;
  --color-charcoal: #2D3748;
  --gradient-primary: linear-gradient(135deg, #FF6B6B 0%, #95D5B2 100%);
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* Enhanced Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse {
  animation: pulse 3s ease-in-out infinite;
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

.animate-ping {
  animation: twinkle 2s ease-in-out infinite;
}

/* Navigation Enhancements */
.nav {
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-link {
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #FF6B6B 0%, #95D5B2 100%);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* Enhanced Hero Section */
.hero {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(149, 213, 178, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.hero-badge {
  border: 1px solid rgba(255, 107, 107, 0.2);
  backdrop-filter: blur(4px);
}

.gradient-text {
  background: linear-gradient(135deg, #FF6B6B 0%, #95D5B2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Enhanced Beads */
.bead {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bead:hover {
  transform: scale(1.1) !important;
  z-index: 10;
}

/* Floating Elements */
.code-snippet {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  backdrop-filter: blur(4px);
}

/* Enhanced Cards */
.collection-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.collection-card:hover {
  transform: translateY(-12px) rotateX(5deg);
  box-shadow: var(--shadow-xl);
}

.primary-card {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.02) 0%, rgba(149, 213, 178, 0.02) 100%);
  border: 2px solid rgba(255, 107, 107, 0.1);
}

/* Image overlays */
.image-overlay {
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.collection-card:hover .image-overlay {
  opacity: 1;
}

/* Button Enhancements */
.btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.btn-icon {
  transition: all 0.3s ease;
}

.btn-icon:hover {
  transform: translateX(4px);
}

/* Profile Card */
.profile-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.placeholder-profile::before {
  content: '👨‍💻';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
}

/* Process Steps */
.process-step {
  transition: all 0.3s ease;
  background: rgba(247, 250, 252, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.process-step:hover {
  background: white;
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.step-number {
  background: linear-gradient(135deg, #FF6B6B 0%, #95D5B2 100%);
  display: inline-flex !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .nav-menu.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 1rem;
    box-shadow: var(--shadow-lg);
  }
  
  .mobile-menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .mobile-menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  
  .mobile-menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
  
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-stats {
    justify-content: center;
    gap: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
  }
  
  .collections-grid {
    grid-template-columns: 1fr;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .bead-showcase {
    width: 300px;
    height: 300px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
}

/* Notification styles */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10b981;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 9999;
  max-width: 300px;
  font-family: inherit;
  font-weight: 500;
}
</style>
