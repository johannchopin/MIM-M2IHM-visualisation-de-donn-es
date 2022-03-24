<script>
  import { onMount } from "svelte";

  import { data as dataStore, EntrepriseHeader } from "$lib/stores";
  import { BarChart } from "$lib/charts";
  
  let mounted = false;
  const EXPERTISE_NAME = [
    "Débutant",
    "Intermédiaire",
    "Confirmé",
    "Expert",
    "Pas intéressée",
  ];

  const CATEGORIES = [
    "1",
    "2",
    "3",
    "4",
    "5",
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
    //console.log(data);
    return [
      { entreprise: "1", value: 0.5 },
      { entreprise: "2", value: 0 },
      { entreprise: "3", value: 1.5 },
      { entreprise: "4", value: 1.8 },
      { entreprise: "5", value: 1.2 },
      { entreprise: "6", value: 2 },
      { entreprise: "7", value: 4.5 },
      { entreprise: "8", value: 4.9 },
      { entreprise: "9", value: 4.4 },
      { entreprise: "10", value: 4.4 },
      { entreprise: "11", value: 4.4 },
      { entreprise: "12", value: 3.5 },
      { entreprise: "13", value: 3.6 },
      { entreprise: "14", value: 5 },
      { entreprise: "15", value: 2.8 },
      { entreprise: "16", value: 0.6 },
      { entreprise: "17", value: 0.6 },
      { entreprise: "18", value: 2.7 },
      { entreprise: "19", value: 3 },
      { entreprise: "20", value: 3.2 },
      { entreprise: "21", value: 3.1 },
      { entreprise: "22", value: 4.5 },
      
    ]
    //return data;
  };

  const generateGraph = (id) => {
    const chart = BarChart(getGraphData(id), {
      x: (d) => d.entreprise ,
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

<div class="row align-items-center">
  <div class="col-9">
    <button class="btn btn-secondary">Arrange</button>
  </div>
  <div class="col-1" style="text-align: end;">
    Catégorie:
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
    <div id="barChart" class="p-5"/>
  </div>
</div>