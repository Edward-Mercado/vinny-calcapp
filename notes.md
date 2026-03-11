# L3 - Async Vue: Project Walkthrough

Welcome! In this walkthrough we're going to explore a real Vue 3 app — a **Pokédex** that fetches data from the internet and displays it on screen. By the end you'll understand how Vue components are structured, how to fetch data asynchronously, what the component lifecycle is, and how `watch` works.

---

## The Big Picture: What Does This App Do?

The app has two "pages":

1. **Home page (`/`)** — shows a grid of the original 151 Pokémon as clickable cards.
2. **Detail page (`/PokemonData/:id`)** — shows detailed info about a single Pokémon when you click a card.

All the data comes from a free public API: `https://pokeapi.co`

---

## How a Vue App Starts: `main.js`

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

**Analogy:** Think of `main.js` as the ignition key for a car. It starts the engine (`createApp`), plugs in the GPS (`router`), and parks the car in the garage (`mount('#app')` — meaning "put my app inside the HTML element with id `app`").

Everything in the app flows out from here.

---

## Anatomy of a Vue Component

Every `.vue` file has three sections:

```vue
<template>
  <!-- What the user SEES (HTML) -->
</template>

<script setup>
  // What the component KNOWS and DOES (JavaScript)
</script>

<style scoped>
  /* How it LOOKS (CSS — scoped means it only affects this component) */
</style>
```

**Analogy:** Think of a component like a LEGO brick:
- The **template** is the shape of the brick (what it looks like).
- The **script** is the color and material (what it's made of / how it works).
- The **style** is the paint job.

---

## The Router: Your App's GPS — `router/index.js`

```js
const router = createRouter({
  routes: [
    { path: '/',                  component: HomeView },
    { path: '/PokemonData/:id',   component: PokemonData }
  ]
})
```

The router maps **URLs → components**. When the user goes to `/`, Vue loads `HomeView`. When they go to `/PokemonData/pikachu`, Vue loads `PokemonData`.

The `:id` part is a **route parameter** — it's a placeholder that can hold any value (like a Pokémon name). Think of it like a variable inside the URL.

**Analogy:** The router is like a receptionist at a hotel. You walk in and say "I want room PokemonData/pikachu" and they send you to exactly the right room (component).

### `App.vue` — The Shell

```vue
<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>
```

`App.vue` is the outermost wrapper of your app. It doesn't do much on its own — it just renders `<RouterView />`, which is a placeholder that says "put whatever page component belongs to the current URL right here."

---

## `ref` — Making Data Reactive

Before we dig into the pages, you need to know what `ref` is.

```js
const pokemon = ref([])
const isLoading = ref(false)
```

`ref` creates a **reactive variable**. "Reactive" means: whenever this variable changes, Vue automatically updates the screen to reflect the new value. You don't have to do anything — Vue watches it for you.

**Analogy:** A `ref` is like a scoreboard at a basketball game. The moment the score changes, the scoreboard updates automatically for everyone watching. Without `ref`, changing a variable would be like writing the score on a whiteboard in the back room — nobody can see it update.

> **Note:** To read or write a `ref` inside JavaScript, you use `.value` (e.g., `pokemon.value = []`). But in the template (HTML), Vue automatically unwraps it — you just write `pokemon` directly.

---

## `HomeView.vue` — The Main Page

This is where most of the interesting stuff happens.

```vue
<script setup>
import { ref, onMounted } from 'vue'
import PokemonCard from '../components/PokemonCard.vue'

const pokemon = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

async function getPokemon() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0')

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    pokemon.value = Array.isArray(data.results) ? data.results : []
  } catch (error) {
    pokemon.value = []
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load pokemon list.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getPokemon()
})
</script>
```

There's a lot here. Let's break it down piece by piece.

---

### Async / Await — Waiting Without Freezing

Fetching data from the internet takes time. If your code just stopped and waited, your entire webpage would freeze — the user couldn't scroll, click, or do anything.

`async/await` solves this. It lets your function **pause and wait** for a slow operation (like a network request) without blocking the rest of the app.

```js
async function getPokemon() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
  const data = await response.json()
  pokemon.value = data.results
}
```

- `async` before a function means "this function can pause and wait."
- `await` before an operation means "pause here until this finishes, then continue."

**Analogy:** Imagine you're at a restaurant. You place your order (call `fetch`), then you `await` the food — you don't stand at the kitchen window staring. You sit down, chat, and the waiter brings it when it's ready. The rest of the restaurant keeps running normally while your food is being made.

---

### try / catch / finally — Handling Things Going Wrong

Internet requests can fail. The API might be down, the user might be offline, or the data might be in an unexpected format. `try/catch/finally` lets you handle errors gracefully.

```js
try {
  // Try to do this...
  const response = await fetch(url)
  if (!response.ok) throw new Error('Request failed')
  const data = await response.json()
  pokemon.value = data.results
} catch (error) {
  // If anything goes wrong, run this instead
  errorMessage.value = error.message
} finally {
  // This ALWAYS runs, whether it worked or failed
  isLoading.value = false
}
```

**Analogy:**
- `try` — "Let me attempt to catch this baseball..."
- `catch` — "...if I drop it, here's what I do instead (pick it up, apologize, etc.)"
- `finally` — "...either way, I'm going to put my glove away when it's over."

The `finally` block is perfect for turning off a loading spinner — you always want loading to stop, whether the request worked or not.

---

### The Component Lifecycle & `onMounted`

A Vue component has a **lifecycle** — it goes through stages from being created to being destroyed.

```
Created → Mounted → Updated (many times) → Unmounted
```

| Stage | What it means |
|---|---|
| **Created** | Vue sets up the component's data and logic |
| **Mounted** | The component's HTML is added to the actual page (DOM) |
| **Updated** | Data changes, and Vue re-renders the template |
| **Unmounted** | The component is removed from the page |

**Analogy:** Think of a component like a TV show episode:
- **Created** → The episode is written and filmed (setup).
- **Mounted** → The episode airs on TV (it's now visible to viewers).
- **Updated** → The show evolves each episode as things happen.
- **Unmounted** → The series ends, the show goes off the air.

`onMounted` is a **lifecycle hook** — it's a function you register to run at a specific stage of the lifecycle.

```js
onMounted(() => {
  getPokemon()  // Run this when the component appears on screen
})
```

We fetch Pokémon in `onMounted` because that's when the component is on the page and ready to show data. If we tried to fetch in the wrong stage, the HTML might not exist yet to display results into.

---

### The Template: Showing the Data

```vue
<template>
  <div class="container">
    <PokemonCard
      v-for="(monster, index) in pokemon"
      :key="monster.name"
      :id="index + 1"
      :pokemon="monster"
    />
    <p v-if="isLoading" class="status">Loading...</p>
    <p v-else-if="errorMessage" class="status error">{{ errorMessage }}</p>
  </div>
</template>
```

#### `v-for` — Looping Through a List

```vue
<PokemonCard v-for="(monster, index) in pokemon" :key="monster.name" />
```

`v-for` is Vue's way of repeating HTML for every item in an array. Here, for every Pokémon in our `pokemon` array, it creates one `<PokemonCard>` component.

**Analogy:** It's like a copy machine. You put in one template card and say "make one of these for each item on this list" — and it stamps out 151 cards.

The `:key` attribute helps Vue keep track of which card is which when the list updates. Always use a unique value like a name or ID.

#### `v-if` / `v-else-if` — Conditional Rendering

```vue
<p v-if="isLoading">Loading...</p>
<p v-else-if="errorMessage">{{ errorMessage }}</p>
```

These directives show or hide elements based on conditions — just like an `if/else` in regular JavaScript, but written directly in the HTML.

---

## `PokemonCard.vue` — A Reusable Component

```vue
<template>
  <router-link :to="pkmnPath" class="card">
    <h2>{{ pokemon.name }}</h2>
    <h3>{{ id }}</h3>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pokemon: { type: Object, required: true },
  id:      { type: Number, required: true }
})

const pkmnPath = computed(() => {
  return `/PokemonData/${props.pokemon.name}`
})
</script>
```

### Props — Passing Data Into a Component

Props are how a parent component sends data **down** to a child component.

In `HomeView.vue`:
```vue
<PokemonCard :pokemon="monster" :id="index + 1" />
```

In `PokemonCard.vue`:
```js
const props = defineProps({
  pokemon: { type: Object, required: true },
  id:      { type: Number, required: true }
})
```

**Analogy:** Props are like filling out a form when you order a custom t-shirt. The customer (parent component) fills in the name and size (props), and the factory (child component) uses those details to make the right shirt.

### `computed` — Derived Data That Stays Up to Date

```js
const pkmnPath = computed(() => {
  return `/PokemonData/${props.pokemon.name}`
})
```

A `computed` value is like a formula — it's automatically recalculated whenever its dependencies change. Here, `pkmnPath` depends on `props.pokemon.name`. If the name ever changed, the path would update automatically.

**Analogy:** Think of a `computed` as a spreadsheet formula. Cell A1 = price, Cell A2 = tax, Cell A3 = `=A1 * A2`. You never manually update A3 — it always stays correct based on A1 and A2.

### `<router-link>` — Navigation Without Page Reload

Instead of a normal `<a href>` tag (which reloads the entire page), `<router-link>` navigates within the app without a full reload, keeping it fast and smooth.

---

## `PokemonData.vue` — The Detail Page

This page is where **`watch`** comes in — the most important new concept in this lesson.

```vue
<template>
  <div>
    <h1 v-if="pokemon">{{ pokemon.name }}</h1>
    <p v-else>Loading...</p>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pokemon = ref(null)

async function getPokemon(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  pokemon.value = await response.json()
}

watch(
  () => route.params.id,
  function (id) {
    getPokemon(id)
  }
)

onMounted(function () {
  getPokemon(route.params.id)
})
</script>
```

### `useRoute` — Reading the URL

```js
const route = useRoute()
```

`useRoute` gives you access to the current URL's information. Since our route is `/PokemonData/:id`, we can read `route.params.id` to get the Pokémon name from the URL.

For example, if the URL is `/PokemonData/pikachu`, then `route.params.id` is `"pikachu"`.

### `onMounted` Here

```js
onMounted(function () {
  getPokemon(route.params.id)
})
```

When this page first loads, we immediately fetch the Pokémon data for whatever `:id` is in the URL. Same idea as in `HomeView` — fetch when the component appears on screen.

### `watch` — Reacting to Changes

```js
watch(
  () => route.params.id,
  function (id) {
    getPokemon(id)
  }
)
```

Here's the problem `watch` solves: If the user is already on `/PokemonData/pikachu` and clicks a card that goes to `/PokemonData/charmander`, the URL changes — but Vue **reuses** the existing `PokemonData` component instead of destroying and recreating it. That means `onMounted` won't fire again!

`watch` lets you run code **whenever a specific value changes**. It takes two arguments:
1. **What to watch** — a function that returns the value you care about (`() => route.params.id`).
2. **What to do** — a function that runs whenever that value changes, receiving the new value.

**Analogy:** `watch` is like a smoke detector. You don't check for smoke yourself — you set up the detector once and it automatically alerts you *when something changes* (when smoke appears). You don't have to constantly check.

Without `watch`, navigating between Pokémon detail pages would be broken — the page would stay stuck showing the first Pokémon you clicked.

#### Why Both `onMounted` AND `watch`?

| Situation | What fires |
|---|---|
| User navigates TO this page for the first time | `onMounted` |
| User is already on this page and the URL changes | `watch` |

You need both to cover all cases!

---

## Data Flow Summary

Here's how everything connects:

```
main.js
  └── App.vue  (renders the current route)
        ├── HomeView.vue  (fetches 151 Pokémon on mount)
        │     └── PokemonCard.vue × 151  (shows name + id, links to detail)
        └── PokemonData.vue  (fetches one Pokémon on mount + when URL changes)
```

---

## Key Concepts Recap

| Concept | What it does | Analogy |
|---|---|---|
| `ref` | Makes a variable reactive (auto-updates the UI) | A live scoreboard |
| `async/await` | Waits for slow operations without freezing the page | Ordering food at a restaurant |
| `try/catch/finally` | Handles errors gracefully | Catching a ball — and cleaning up either way |
| `onMounted` | Runs code when the component appears on screen | Opening a shop for the day |
| `watch` | Runs code whenever a specific value changes | A smoke detector |
| `computed` | A value derived from other values, always up to date | A spreadsheet formula |
| Props | Data passed from parent to child component | Filling out a custom order form |
| `v-for` | Loops through a list and creates one element per item | A copy machine |
| `v-if` | Shows/hides HTML based on a condition | A light switch |
| Router / `<RouterView>` | Maps URLs to components | A hotel receptionist |