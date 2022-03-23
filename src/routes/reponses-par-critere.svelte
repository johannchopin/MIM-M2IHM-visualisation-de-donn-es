<script>
  import { onMount } from "svelte";

  import { data as dataStore, EntrepriseHeader } from "$lib/stores";
  import { StackedBarChart } from "$lib/charts";
  
  let mounted = false;
  const EXPERTISE_NAME = [
    "Débutant",
    "Intermédiaire",
    "Confirmé",
    "Expert",
    "Pas intéressée",
  ];

  const CATEGORIES = [
    "Région",
    "Secteur d'activités",
    "Taille",
    "Chiffre d'affaires",
    "Fonction",
  ];
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

  const getGraphData = (id) => {
    let entrepriseIdInRegion = {};

    $dataStore.entreprises.forEach(entreprise => {
      const region = entreprise[EntrepriseHeader.REGION]
      if (entrepriseIdInRegion[region]) {
        entrepriseIdInRegion[region].push(entreprise)
      } else {
        entrepriseIdInRegion[region] = []
      }
    })

    
    /*
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
        region: expertiseLevels[expertiseLevel],
        value: expertiseLevels[expertiseLevel],
      };
    });
*/
    

    console.log("data"); 
    console.log(data);
    return [
      { critère: "Lorraine", value: "1", count: 35},
      { critère: "Lorraine", value: "2", count: 135},
      { critère: "Lorraine", value: "3", count: 235},
      { critère: "Metz", value: "4", count: 35},
      { critère: "Metz", value: "5", count: 35}
    ]
    return data;
  };

  const generateGraph = (id) => {
    const chart = StackedBarChart(getGraphData(id), {
      x: (d) => d.count ,
      y: (d) => d.critère,
      z: (d) => d.value,
    });

    const stackedBarChart = document.getElementById("stackedBarChart");

    stackedBarChart.innerHTML = "";
    stackedBarChart.append(chart);
  };

  onMount(() => {
    mounted = true;
  });

  $: {
    if (mounted) {
      generateGraph(categorieSelected);
    }
  }
</script>
<div class="row">
  <div class="col-md-12">
    <h1>Tâche visuelle n°2.</h1>
  </div>
</div>
<div class="row">
  <div class="col-md-12">
    <p>
      Ici est représenté la répartition des réponses de 67 entreprises au questionnaire selon plusieurs critères.
    </p>
  </div>
</div>

<div class="row justify-content-end align-items-center">
  <div class="col-1" style="text-align: end;">
    Critère:
  </div>
  <div class="col-2">
    <select
      bind:value={categorieSelected}
      class="form-select"
    >
      {#each CATEGORIES as categorie}
        <option value={categorie}
          >{categorie}</option
        >
      {/each}
    </select>
  </div>
</div>
<div class="row text-center">
  <div class="col-md-12">
    <div id="stackedBarChart" class="p-5"/>
  </div>
</div>