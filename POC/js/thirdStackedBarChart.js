var finalData = [];
var columns = ["region","nv1","nv2","nv3","nv4","nv5"];
finalData.columns=columns;
console.log("starting ...");
d3.csv("data/reponses_entreprises.csv", function(error, data) {
    var datas = data;
    console.log("first read");
    d3.csv("data/profils_entreprises.csv", function(error, data) {
        console.log("second read");
        for(var i=0;i<67;i++){
            datas[i].entreprise = data[i].region;
        }
        var line = {}
        var cw1=0,cw2=0,cw3=0,cw4=0,cw5=0,tw=0;
        var clu1=0,clu2=0,clu3=0,clu4=0,clu5=0,tlu=0;
        var cr1=0,cr2=0,cr3=0,cr4=0,cr5=0,tr=0;
        var cs1=0,cs2=0,cs3=0,cs4=0,cs5=0,ts=0;
        var clo1=0,clo2=0,clo3=0,clo4=0,clo5=0,tlo=0;
        var ca1=0,ca2=0,ca3=0,ca4=0,ca5=0,ta=0;

        for(var i=0;i<67;i++){
            for (let j = 0; j<38; j++) {
                if (datas[i].entreprise == "Wallonie") {
                    ques = "question" + j;
                    if (datas[i][ques] == 1) {
                        cw1++
                    }
                    if (datas[i][ques] == 2) {
                        cw2++
                    }
                    if (datas[i][ques] == 3) {
                        cw3++
                    }
                    if (datas[i][ques] == 4) {
                        cw4++
                    }
                    if (datas[i][ques] == 5) {
                        cw5++
                    }
                }
                if (datas[i].entreprise == "Luxembourg") {
                    ques = "question" + j;
                    if (datas[i][ques] == 1) {
                        clu1++
                    }
                    if (datas[i][ques] == 2) {
                        clu2++
                    }
                    if (datas[i][ques] == 3) {
                        clu3++
                    }
                    if (datas[i][ques] == 4) {
                        clu4++
                    }
                    if (datas[i][ques] == 5) {
                        clu5++
                    }                    
                }
                if (datas[i].entreprise == "Rheinland-Pfalz") {
                    ques = "question" + j;
                    if (datas[i][ques] == 1) {
                        cr1++
                    }
                    if (datas[i][ques] == 2) {
                        cr2++
                    }
                    if (datas[i][ques] == 3) {
                        cr3++
                    }
                    if (datas[i][ques] == 4) {
                        cr4++
                    }
                    if (datas[i][ques] == 5) {
                        cr5++
                    }
                }
                if (datas[i].entreprise == "Saarland") {
                    ques = "question" + j;
                    if (datas[i][ques] == 1) {
                        cs1++
                    }
                    if (datas[i][ques] == 2) {
                        cs2++
                    }
                    if (datas[i][ques] == 3) {
                        cs3++
                    }
                    if (datas[i][ques] == 4) {
                        cs4++
                    }
                    if (datas[i][ques] == 5) {
                        cs5++
                    }                    
                }
                if (datas[i].entreprise == "Lorraine") {
                    ques = "question" + j;
                    if (datas[i][ques] == 1) {
                        clo1++
                    }
                    if (datas[i][ques] == 2) {
                        clo2++
                    }
                    if (datas[i][ques] == 3) {
                        clo3++
                    }
                    if (datas[i][ques] == 4) {
                        clo4++
                    }
                    if (datas[i][ques] == 5) {
                        clo5++
                    }
                }
                if (datas[i].entreprise == "Autre") {
                    ques = "question" + j;
                    if (datas[i][ques] == 1) {
                        ca1++
                    }
                    if (datas[i][ques] == 2) {
                        ca2++
                    }
                    if (datas[i][ques] == 3) {
                        ca3++
                    }
                    if (datas[i][ques] == 4) {
                        ca4++
                    }
                    if (datas[i][ques] == 5) {
                        ca5++
                    }
                }
            }
        }
        tw = cw1+ cw2 + cw3+ cw4+ cw5;
        tlu = clu1+ clu2 + clu3+ clu4+ clu5;
        tr = cr1+ cr2 + cr3+ cr4+ cr5;
        ts = cs1+ cs2 + cs3+ cs4+ cs5;
        tlo = clo1+ clo2 + clo3+ clo4+ clo5;
        ta = ca1+ ca2 + ca3+ ca4+ ca5;
        line = { region: "Wallonie", nv1: cw1, nv2: cw2, nv3: cw3, nv4: cw4, nv5: cw5, total : tw };
        finalData.push(line);
        line = { region: "Luxembourg", nv1: clu1, nv2: clu2, nv3: clu3, nv4: clu4, nv5: clu5, total : tlu };
        finalData.push(line);
        line = { region: "Rheinland-Pfalz", nv1: cr1, nv2: cr2, nv3: cr3, nv4: cr4, nv5: cr5, total : tr };
        finalData.push(line);
        line = { region: "Saarland", nv1: cs1, nv2: cs2, nv3: cs3, nv4: cs4, nv5: cs5, total : ts };
        finalData.push(line);
        line = { region: "Lorraine", nv1: clo1, nv2: clo2, nv3: clo3, nv4: clo4, nv5: clo5, total : tlo };
        finalData.push(line);
        line = { region: "Autre", nv1: ca1, nv2: ca2, nv3: ca3, nv4: ca4, nv5: ca5, total : ta };
        finalData.push(line);
        console.log("my finalData is ready");

    var svg = d3.select("#svg3"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1);
    
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);
    
    var z = d3.scaleOrdinal().range([  "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    
    d3.csv("data/reponses_entreprises.csv",
     function(d, i, columns) {for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];d.total = t;return d;},
     function(error, data) {
        
        if (error) throw error;
        data = finalData;
        console.log(data);
        console.log("drawing");
        var keys = data.columns.slice(1);
        
        data.sort(function(a, b) { return b.total - a.total; });
        x.domain(data.map(function(d) { return d.region; }));
        y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
        z.domain(keys);
        
        g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(data))
            .enter().append("g")
            .attr("fill", function(d) { return z(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d.data.region); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth());
        
        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Nombre de réponse");
        
        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        
        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);
        
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });
        });
    

    });
});


