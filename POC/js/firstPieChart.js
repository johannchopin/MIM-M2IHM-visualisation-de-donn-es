d3.csv("data/reponses_entreprises.csv", function(error, data) {
    var c1=0,c2=0,c3=0,c4=0,c5=0;
    var datas = [];

    var elements = Object.keys(data[0])
		.filter(function(d){
			return (d != "entreprise");
		});
    
    for(var i=0;i<36;i++){
        for(var j=0;j<67;j++){
            if(data[j][elements[i]]==1) c1++;
            if(data[j][elements[i]]==2) c2++;
            if(data[j][elements[i]]==3) c3++;
            if(data[j][elements[i]]==4) c4++;
            if(data[j][elements[i]]==5) c5++;
        }
        line = { question: i+1, nv1: c1, nv2: c2, nv3: c3, nv4: c4, nv5: c5 };
        datas.push(line);
        c1=0,c2=0,c3=0,c4=0,c5=0;
    }

    var niveaux = Object.keys(datas[0])
        .filter(function(d){
            return (d != "question");
        });
    var selectedNiveau = niveaux[0];

    var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3.pie()
        .sort(null)
        .value(function (d){
            return d[selectedNiveau];
        });

    var svg = d3.select("#svg1")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
    svg.append("g").attr("class", "slices");
    
    var g = svg.selectAll(".arc")
        .data(pie(datas))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.question); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return  d.data.question; });


    var selector = d3.select("#select1")
        .append("select")
        .attr("id","dropdown1")
        .on("change", function(d){
            selectedNiveau = document.getElementById("dropdown1").value;
            svg = d3.select("#svg1")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
                pie = d3.pie()
                .value(function(d) {return d[selectedNiveau]; })
                .sort(null) 
            
            var g = svg.selectAll(".arc")
                .data(pie(datas))
                .enter().append("g")
                .attr("class", "arc");
        
            g.append("path")
                .attr("d", arc)
                .transition()
                .duration(1000)
                .style("fill", function(d) { return color(d.data.question); });
        
            g.append("text")
                .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .transition()
                .duration(1000)
                .text(function(d) { return  d.data.question; });
            
            
                g
                .exit()
                .remove()
        });

    selector.selectAll("option")
        .data(niveaux)
        .enter().append("option")
        .attr("value", function(d){
            return d;
        })
        .text(function(d){
            return d;
        });
});
