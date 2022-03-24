<script lang="ts">
  import { onMount } from "svelte";

  import { data as dataStore, EntrepriseHeader } from "$lib/stores";
  import { BarChart } from "$lib/charts";

  let mounted = false;

  const CATEGORIES = ["1", "2", "3", "4", "5"];
  let categorieSelected = CATEGORIES[0];

  const getExpertiseLevelFromAnswer = (answer) => {
    const expertiseLevels = {};

    answer.forEach((expertiseLevelValue) => {
      expertiseLevelValue = expertiseLevelValue.replace("\r", ""); // sanitize line return
      if (expertiseLevels[expertiseLevelValue]) {
        expertiseLevels[expertiseLevelValue] += 1;
      } else {
        expertiseLevels[expertiseLevelValue] = 1;
      }
    });

    return expertiseLevels;
  };

  const getQuestionsByCategorie = (criteriaId: string): string[] => {
    const criterias: { [key: string]: string[] } = {};

    $dataStore.categories.forEach((criteria) => {
      const question = criteria[0];
      let categorie = criteria[1];
      if (categorie) {
        categorie = categorie.trim();

        if (criterias[categorie]) {
          criterias[categorie].push(question);
        } else {
          criterias[categorie] = [question];
        }
      }
    });

    return criterias[criteriaId];
  };

  const getGraphData = (id) => {
    let entrepriseIdInRegion = {};

    const average = (array) => {
      if (array.length === 0 ) {
        return 0
      }
      return array.reduce((a, b) => a + b) / array.length
    };

    const questions = getQuestionsByCategorie(id);

    const data = []

    $dataStore.answers.forEach((answer, i) => {
      const expertises = []

      questions.forEach(questionId => {
        const expertise = answer[questionId]
        if (expertise) {
          expertises.push(Number(expertise.replace('\r', '')))
        }
      })

      console.log(expertises);
      

      data.push({entreprise: (i + 1).toString(), value: average(expertises)})
    });

    

    return data
  };

  const generateGraph = (id) => {
    const chart = BarChart(getGraphData(id), {
      x: (d) => d.entreprise,
      y: (d) => d.value,
    });

    const barChart = document.getElementById("barChart");

    barChart.innerHTML = "";
    barChart.append(chart);
  };

  onMount(() => {
    mounted = true;
  });

  $: {
    if (mounted) {
      generateGraph(categorieSelected);
    }
  };
</script>

<div class="row">
  <div class="col-md-12">
    <h1>Tâche visuelle n°3.</h1>
  </div>
</div>
<div class="row">
  <div class="col-md-12">
    <p>
      Ici est représenté la répartition des réponses moyennes des 67 entreprises au questionnaire selon une catégorie de question.
    </p>
  </div>
</div>

<div class="row justify-content-end align-items-center">
  <div class="col-1" style="text-align: end;">Catégorie:</div>
  <div class="col-2">
    <select bind:value={categorieSelected} class="form-select">
      {#each CATEGORIES as categorie}
        <option value={categorie}>{categorie}</option>
      {/each}
    </select>
  </div>
</div>

<div class="row text-center">
  <div class="col-md-12">
    <div id="barChart" class="p-5" />
  </div>
</div>
