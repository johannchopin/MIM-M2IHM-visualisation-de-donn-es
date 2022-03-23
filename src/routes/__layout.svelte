<script context="module">

  const ENTREPRISE = 'entreprise'
  const SA = 'secteur d\'activit�'

  export async function load({ fetch }) {
    const url = `/data/profils_entreprises.csv`;
    const response = await fetch(url);
    const rows = (await response.text()).split("\n")

    rows.forEach((row) => {
      const columns = row.split(";"); //SPLIT COLUMNS
      console.log(columns);
    })
  
    return {
      status: response.status,
      props: {
        test: "",
      },
    };
  }
</script>

<script lang="ts">
  import "../styles/global.scss";
  import Navbar from "$lib/components/Navbar.svelte";
</script>

<Navbar />
<main class="container">
  <slot />
</main>
