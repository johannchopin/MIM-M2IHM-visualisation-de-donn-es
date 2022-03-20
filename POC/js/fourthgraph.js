d3.csv("data/reponses_entreprises.csv", function (error, data){

	// lever une erreur si échec lors de l'import des données
	if (error) throw error;
	// récupération des en-têtes "noms de boissons"
	var elements = Object.keys(data[0])
		.filter(function(d){
			return (d != "entreprise");
		});
	var selectedQuestion = elements[0]; // par défaut, la première boisson est sélectionnée
	
	// décrlatation des marges et récupération des dimensions du svg: largeur et hauteur 
	var margin = {top: 20, right: 20, bottom: 40, left: 40}, 
		width = d3.select("#svg4").node().getBoundingClientRect().width-margin.left-margin.right, 
		height = d3.select("#svg4").node().getBoundingClientRect().height-margin.bottom-margin.top;
	
	// déclaration de la fonction de passage à l'échelle pour l'abscisse 
	var xScale= d3.scaleBand().domain(data.map(d => d.entreprise)).range([margin.left, width]);
    
	// déclaration de la fonction de passage à l'échelle pour l'ordonnée 	
	var yScale= d3.scaleLinear().domain([0, d3.max(data.map(d => d[selectedQuestion]))]).range([height, margin.top]); 

	// définition du constructeur de l'axe abscisse
	var xAxis= g => g
		.attr("transform", `translate(0, ${height})`)
		.call(d3.axisBottom(xScale));
	
	// définition du constructeur de l'axe ordonnée
	var yAxis= g => g
		.attr("transform", `translate(${margin.left}, 0)`)
		.call(d3.axisLeft(yScale));
	
	// appels aux constructeurs d'axes	
	var Abscissa= d3.select('#svg4').append("g").attr("class", "xAxis").call(xAxis);
	var ordinate= d3.select('#svg4').append("g").attr("class", "yAxis").call(yAxis);
	
	// ajout du labelle de l'axe abscisse
    //label lte7t
	d3.select('#svg4').append("text")             
		.attr("transform", `translate(${width}, ${height+margin.top+15})`)
		.style("text-anchor", "end")
		.text("Entreprise");
	  
	// ajout du labelle de l'axe ordonnée
    //label a gauche
	d3.select('#svg4').append("text")
		.attr("transform", "rotate(-90)")	
		.attr("y", 15)
		.attr("x", -margin.top)
		.style("text-anchor", "end")
		.text("Réponse");
	
	// sélection vide, association de données, créaction des bars interactives, dimensionnement et positionnement des barres selon les échelles prédéfinies
	//les barres li ldakhel
    var bars = d3.select('#svg4').selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.style("fill", "blue")
		.attr("y", function(d){
			return yScale(+d[selectedQuestion]);
		})
		.attr("height",  function(d){
			return yScale(0) - yScale(+d[selectedQuestion]);
		})
		.attr("width", xScale.bandwidth()-1)
		.attr("x", function(d, i) {
			return xScale(d.entreprise);
		})
		.on("mouseover", function(d){
			d3.select(this).style("fill", "black");
		})
		.on("mouseout", function(d){
			d3.select(this).style("fill", "blue");
		});
	
	// créer un élément select avec un événement lors du changement de valeur de l'option choisie
	var selector = d3.select("#select4")
    	.append("select")
    	.attr("id","dropdown4")
    	.on("change", function(d){
        	var selectedElement = document.getElementById("dropdown4");
			console.log(selectedElement);
			// redéfinir la fonction de passage à l'échelle pour l'ordonnée avec la nouvelle boisson choisie
        	yScale.domain([0, d3.max(data, function(d){ return +d[selectedElement.value]; })]);

			// transition pour les barres
        	bars.transition()
				.duration(1000)
	            .attr("height", function(d){
					return yScale(0) - yScale(+d[selectedElement.value]);
				})
				.attr("y", function(d){
					return yScale(+d[selectedElement.value]);
				});
			
			// transition pour l'axe ordonnée
           	ordinate.transition()
				.duration(1000)
           		.call(yAxis);
         });

	// création des option du select avec les en-têtes des boissons
    selector.selectAll("option")
      .data(elements)
      .enter().append("option")
      .attr("value", function(d){
        return d;
      })
      .text(function(d){
        return d;
      });
});
