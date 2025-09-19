<script setup>
import { Link, usePage } from '@inertiajs/vue3'

const loggedInUser = usePage().props.loggedInUser
</script>

<template>
  <div class="flex min-h-screen flex-col bg-cream">
    <!-- Simple hidden nav for auth routes -->
    <nav class="glass-effect fixed w-full z-50" v-if="loggedInUser || $page.url.startsWith('/login') || $page.url.startsWith('/signup')">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-4">
          <Link href="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-br from-coral to-sage rounded-full"></div>
            <span class="text-xl font-bold text-charcoal">Pheeya</span>
          </Link>
          <ul
            class="flex items-center justify-items-end space-x-4 text-sm"
            v-if="!loggedInUser"
          >
            <li>
              <Link href="/login" class="text-charcoal hover:text-coral transition-colors md:text-lg">Login</Link>
            </li>
            <li>
              <Link
                href="/signup"
                class="rounded-full bg-coral px-6 py-2 text-white hover:bg-coral-600 transition-colors"
                >Sign up</Link
              >
            </li>
          </ul>
          <section class="flex items-center space-x-6" v-else>
            <Link href="/dashboard" class="text-charcoal hover:text-coral transition-colors md:text-lg">Dashboard</Link>
            <Link href="/profile">
              <p
                class="rounded-full bg-sage p-2 text-white"
                v-if="!loggedInUser.googleAvatarUrl"
              >
                {{ loggedInUser.initials }}
              </p>
              <img
                v-else
                class="h-12 w-12 rounded-full border-2 border-gray-100"
                :src="loggedInUser.googleAvatarUrl"
                :alt="loggedInUser.fullName"
              />
            </Link>
          </section>
        </div>
      </div>
    </nav>

    <main class="mb-10 min-h-screen">
      <slot></slot>
    </main>

    <footer class="bg-charcoal text-white py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8">
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-br from-coral to-sage rounded-full"></div>
              <span class="text-xl font-bold">Pheeya</span>
            </div>
            <p class="text-gray-400">Crafting beauty at the intersection of code, music, and beads.</p>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Shop</h3>
            <div class="space-y-2 text-gray-400">
              <p>Collections</p>
              <p>Custom Orders</p>
              <p>Gift Cards</p>
            </div>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Connect</h3>
            <div class="space-y-2 text-gray-400">
              <p>Instagram</p>
              <p>GitHub</p>
              <p>Spotify Playlists</p>
            </div>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Contact</h3>
            <div class="space-y-2 text-gray-400">
              <p>hello@pheeya.com</p>
              <p>Custom Commissions</p>
              <p>Wholesale Inquiries</p>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Pheeya. Crafted with ❤️, ☕, and clean code.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
