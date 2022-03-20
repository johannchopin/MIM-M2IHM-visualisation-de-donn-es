d3.csv("data/reponses_entreprises.csv", function (error, data){
	// lever une erreur si échec lors de l'import des données
	if (error) throw error;
	var entr;
	var datas = [];
	var entr;
	var ques;
	
	for(var i=1;i<37;i++){
		var line = {};
		quess = "question";
		line[quess] = "" + i;
		for(var j=0;j<67;j++){
			entr = "entreprise" + (j+1);
			ques = "question" + i;
			line[entr] = data[j][ques];
		}
        datas.push(line);
	}

	// récupération des en-têtes "entreprises"

	var elements = Object.keys(datas[0])
		.filter(function(d){
			return (d != "question");
		});
	var selectedItem = elements[0]; // par défaut, la première entreprise est sélectionnée
	
	// décrlatation des marges et récupération des dimensions du svg: largeur et hauteur 
	var margin = {top: 20, right: 20, bottom: 40, left: 40}, 
		width = d3.select("#svg2").node().getBoundingClientRect().width-margin.left-margin.right, 
		height = d3.select("#svg2").node().getBoundingClientRect().height-margin.bottom-margin.top;
	
	// déclaration de la fonction de passage à l'échelle pour l'abscisse
	var xScale= d3.scaleBand().domain(datas.map(d => d.question)).range([margin.left, width]);
    
	// déclaration de la fonction de passage à l'échelle pour l'ordonnée 	
	var yScale= d3.scaleLinear().domain([0, d3.max(datas, function(d){ return +d[selectedItem];	})]).range([height, margin.top]); 
	// définition du constructeur de l'axe abscisse
	var xAxis= g => g
		.attr("transform", `translate(0, ${height})`)
		.call(d3.axisBottom(xScale));
	
	// définition du constructeur de l'axe ordonnée
	var yAxis= g => g
		.attr("transform", `translate(${margin.left}, 0)`)
		.call(d3.axisLeft(yScale));
	
	// appels aux constructeurs d'axes	
	var Abscissa= d3.select('#svg2').append("g").attr("class", "xAxis").call(xAxis);
	var ordinate= d3.select('#svg2').append("g").attr("class", "yAxis").call(yAxis);
	
	// ajout du labelle de l'axe abscisse
    //label lte7t
	d3.select('#svg2').append("text")             
		.attr("transform", `translate(${width}, ${height+margin.top+15})`)
		.style("text-anchor", "end")
		.text("Questions");
	
	// ajout du labelle de l'axe ordonnée
		d3.select('#svg2').append("text")
		.attr("transform", "rotate(-90)")	
		.attr("y", 15)
		.attr("x", -margin.top)
		.style("text-anchor", "end")
		.text("Réponses");
	
	// sélection vide, association de données, créaction des bars interactives, dimensionnement et positionnement des barres selon les échelles prédéfinies
    var bars = d3.select('#svg2').selectAll("rect")
		.data(datas)
		.enter()
		.append("rect")
		.style("fill", "blue")
		.attr("y", function(d){
			return yScale(+d[selectedItem]);
		})
		.attr("height",  function(d){
			return yScale(0) - yScale(+d[selectedItem]);
		})
		.attr("width", xScale.bandwidth()-1)
		.attr("x", function(d, i) {
			return xScale(d.question);
		})
		.on("mouseover", function(d){
			d3.select(this).style("fill", "lightblue");
		})
		.on("mouseout", function(d){
			d3.select(this).style("fill", "blue");
		});
	
	// créer un élément select avec un événement lors du changement de valeur de l'option choisie
	var selector = d3.select("#select2")
    	.append("select")
    	.attr("id","dropdown2")
    	.on("change", function(d){
        	var selectedElement = document.getElementById("dropdown2").value;
			console.log(selectedElement);
			// redéfinir la fonction de passage à l'échelle pour l'ordonnée avec la nouvelle entreprise choisie
        	yScale.domain([0, d3.max(datas, function(d){ return +d[selectedElement]; })]);

			// transition pour les barres
        	bars.transition()
				.duration(1000)
	            .attr("height", function(d){
					return yScale(0) - yScale(+d[selectedElement]);
				})
				.attr("y", function(d){
					return yScale(+d[selectedElement]);
				});
			
			// transition pour l'axe ordonnée
           	ordinate.transition()
				.duration(1000)
           		.call(yAxis);
         });
	
	// création des option du select avec les en-têtes des entreprises
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
