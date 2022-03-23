<script>
  import { onMount } from "svelte";

  import { data as dataStore, EntrepriseHeader } from "$lib/stores";
  import { PieChart } from "$lib/charts";

  let entrepriseId = "--all";
  let mounted = false;
  const EXPERTISE_NAME = [
    "Débutant",
    "Intermédiaire",
    "Confirmé",
    "Expert",
    "Pas intéressée",
  ];

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

  const getGraphData = (id) => {
    let expertiseLevels = {};
    [...Array(5).keys()]
      .map((elmt) => {
        elmt += 1;
        return elmt.toString();
      })
      .forEach((expertiseLevel) => {
        if (isNaN(id)) {
          $dataStore.answers.forEach((answer) => {
            const answerExpertiseLevel = getExpertiseLevelFromAnswer(answer);
            console.log(answerExpertiseLevel);
            if (expertiseLevels[expertiseLevel]) {
              expertiseLevels[expertiseLevel] +=
                answerExpertiseLevel[expertiseLevel] || 0;
            } else {
              expertiseLevels[expertiseLevel] =
                answerExpertiseLevel[expertiseLevel] || 0;
            }
          });
        } else {
          expertiseLevels = getExpertiseLevelFromAnswer(
            $dataStore.answers[Number(id) - 1]
          );
        }
      });

    const data = Object.keys(expertiseLevels).map((expertiseLevel) => {
      return {
        name: EXPERTISE_NAME[Number(expertiseLevel) - 1],
        value: expertiseLevels[expertiseLevel],
      };
    });

    console.log(data);
    return data;
  };

  const generateGraph = (id) => {
    const chart = PieChart(getGraphData(id), {
      // @ts-ignore
      name: (d) => d.name,
      // @ts-ignore
      value: (d) => d.value,
    });

    const pieChart = document.getElementById("pieChart");

    pieChart.innerHTML = "";
    pieChart.append(chart);
  };

  onMount(() => {
    mounted = true;
  });

  $: {
    if (mounted) {
      generateGraph(entrepriseId);
    }
  }
</script>

<div class="row">
  <div class="col-md-12">
    <h1>Tâche visuelle n°1.</h1>
  </div>
</div>
<div class="row">
  <div class="col-md-12">
    <p>
      Ici est représenté la répartition des réponses des 67 entreprises au questionnaire. Il est possible de savoir la répartition
      des réponses globalement mais aussi de le voir par entreprise.
    </p>
  </div>
</div>

<div class="row justify-content-end align-items-center  ">
  <div class="col-1" style="text-align: end;">
    Entreprise:
  </div>
  <div class="col-2">
    <select
      bind:value={entrepriseId}
      class="form-select"
      name="id-entreprise"
      id="id-entreprise-select"
    >
      <option value="--all">Toutes les entreprises</option>
      {#each $dataStore.entreprises as entreprise}
        <option value={entreprise[EntrepriseHeader.ID]}
          >{entreprise[EntrepriseHeader.ID]}</option
        >
      {/each}
    </select>
  </div>
</div>
<div class="row text-center">
  <div class="col-md-12">
    <div id="pieChart" class="p-5"/>
  </div>
</div>
