<script context="module" lang="ts">
  export async function load({ fetch }) {
    const fetchCsv = async (url: string) => {
      const response = await fetch(url);
      const rows = [];
      const _rows = (await response.text()).split("\n");

      const [header, ...data] = _rows;

      data.forEach((row) => {
        const columns = row.split(";");
        rows.push(columns);
      });

      return rows;
    };

    return {
      props: {
        entreprises: await fetchCsv("/data/profils_entreprises.csv"),
        answers: await fetchCsv("/data/réponses_entreprises.csv"),
        categories: await fetchCsv("/data/questions_catégories.csv")
      },
    };
  }
</script>

<script lang="ts">
  import "bootstrap-icons/font/bootstrap-icons.css";
  import "../styles/global.scss";
  import Navbar from "$lib/components/Navbar.svelte";
  import { data as dataStore } from "$lib/stores";
  import Footer from "$lib/components/Footer.svelte";

  export let entreprises;
  export let answers;
  export let categories;

  $dataStore.entreprises = entreprises;
  $dataStore.answers = answers.map((answer) => {
    const [entrepriseId, ...entrepriseAnswers] = answer;
    return entrepriseAnswers;
  });
  $dataStore.categories = categories
</script>

<Navbar />
<main class="container mt-5">
  <slot />
</main>
<Footer />
