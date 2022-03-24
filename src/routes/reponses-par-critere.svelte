<script lang="ts">
  import { onMount } from "svelte";

  import { data as dataStore, EntrepriseHeader } from "$lib/stores";
  import { StackedBarChart } from "$lib/charts";

  let mounted = false;
  let critereSelected = EntrepriseHeader.REGION;

  const getEntreprisesData = (ids: string[]): { [key: string]: number } => {
    const values = {};
    ids.forEach((id) => {
      $dataStore.answers[Number(id)].forEach((answer) => {
        if (values[answer] !== undefined) {
          values[answer] = values[answer] + 1;
        } else {
          values[answer] = 0;
        }
      });
    });

    return values;
  };

  const getEntrepriseIdFromCriteria = (criteria: EntrepriseHeader) => {
    let entrepriseIdInRegion = {};

    $dataStore.entreprises.forEach((entreprise) => {
      const region = entreprise[criteria];
      if (entrepriseIdInRegion[region]) {
        entrepriseIdInRegion[region].push(entreprise[EntrepriseHeader.ID]);
      } else {
        entrepriseIdInRegion[region] = [];
      }
    });

    return entrepriseIdInRegion;
  };

  const getGraphData = (
    criteria
  ): { critère: string; value: string; count: number }[] => {
    const data: { critère: string; value: string; count: number }[] = [];
    let entrepriseIdInRegion = getEntrepriseIdFromCriteria(criteria);

    Object.keys(entrepriseIdInRegion).forEach((region) => {
      const entreprisesData = getEntreprisesData(entrepriseIdInRegion[region]);
      console.log(entreprisesData);

      [...Array(5).keys()]
        .map((elmt) => {
          elmt += 1;
          return elmt.toString();
        })
        .forEach((indice) => {
          data.push({
            critère: region,
            value: indice,
            count: entreprisesData[indice],
          });
        });
    });

    return data;
  };

  const generateGraph = (id) => {
    const chart = StackedBarChart(getGraphData(id), {
      x: (d) => d.count,
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
      generateGraph(critereSelected);
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
      Ici est représenté la répartition des réponses de 67 entreprises au
      questionnaire selon plusieurs critères.
    </p>
  </div>
</div>

<div class="row justify-content-end align-items-center">
  <div class="col-1" style="text-align: end;">Critère:</div>
  <div class="col-2">
    <select bind:value={critereSelected} class="form-select">
      <option value={EntrepriseHeader.REGION}>Région</option>
      <option value={EntrepriseHeader.SA}>Secteur d'activités</option>
      <option value={EntrepriseHeader.TAILLE}>Taille</option>
      <option value={EntrepriseHeader.CA}>Chiffre d'affaires</option>
      <option value={EntrepriseHeader.FONCTION}>Fonction</option>
    </select>
  </div>
</div>
<div class="row text-center">
  <div class="col-md-12">
    <div id="stackedBarChart" class="p-5" />
  </div>
</div>
