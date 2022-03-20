<script lang="ts">
    import '../styles/global.scss'
    import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar/>
<main class="container">
    <slot/>
</main>

