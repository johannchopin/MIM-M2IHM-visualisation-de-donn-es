import * as d3 from "d3";

export function PieChart(data, {
  name = ([x]) => x,  // given d in data, returns the (ordinal) label
  value = ([, y]) => y, // given d in data, returns the (quantitative) value
  title = undefined, // given d in data, returns the title text
  width = 1040, // outer width, in pixels
  height = 650, // outer height, in pixels
  innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
  outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
  labelRadius = (innerRadius * 0.2 + outerRadius * 0.8), // center radius of labels
  format = ",", // a format specifier for values (in the label)
  names = undefined, // array of names (the domain of the color scale)
  colors = ['#D171F0','#57B7F7','#5AE05A','#F7D457','#ED6753'], // array of colors for names
  stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
  strokeWidth = 1, // width of stroke separating wedges
  strokeLinejoin = "round", // line join of stroke separating wedges
  padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
} = {}) {
  // Compute values.
  const N = d3.map(data, name);
  const V = d3.map(data, value);
  const I = d3.range(N.length).filter(i => !isNaN(V[i]));
  
  // Unique the names.
  if (names === undefined) names = N;
  names = new d3.InternSet(names);
  
  // Chose a default color scheme based on cardinality.
  if (colors === undefined) colors = d3.schemeSpectral[names.size];
  if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);
  
  // Construct scales.
  const color = d3.scaleOrdinal(names, colors);
  
  // Compute titles.
  if (title === undefined) {
    const formatValue = d3.format(format);
    title = i => `${N[i]}\n${formatValue(V[i])}`;
  } else {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }
  
  // Construct arcs.
  const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
  
  const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [-width / 2, -height / 2, width, height])
  .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
  svg.append("g")
  .attr("stroke", stroke)
  .attr("stroke-width", strokeWidth)
  .attr("stroke-linejoin", strokeLinejoin)
  .selectAll("path")
  .data(arcs)
  .join("path")
  .attr("fill", d => color(N[d.data]))
  .attr("d", arc)
  .append("title")
  .text(d => title(d.data));
  
  svg.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 15)
  .attr("text-anchor", "middle")
  .selectAll("text")
  .data(arcs)
  .join("text")
  .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
  .selectAll("tspan")
  .data(d => {
    const lines = `${title(d.data)}`.split(/\n/);
    return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
  })
  .join("tspan")
  .attr("x", 0)
  .attr("y", (_, i) => `${i * 1.1}em`)
  .attr("font-weight", (_, i) => i ? null : "bold")
  .text(d => d);
  
  return Object.assign(svg.node(), {scales: {color}});
}
export function StackedBarChart(data, {
  x = d => d, // given d in data, returns the (quantitative) x-value
  y = (d, i) => i, // given d in data, returns the (ordinal) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  title = undefined, // given d in data, returns the title text
  marginTop = 30, // top margin, in pixels
  marginRight = 0, // right margin, in pixels
  marginBottom = 0, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 300, // outer height, in pixels
  xType = d3.scaleLinear, // type of x-scale
  xDomain = [0, 900], // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yDomain, // array of y-values
  yRange, // [bottom, top]
  yPadding = 0.1, // amount of y-range to reserve to separate bars
  zDomain, // array of z-values
  offset = d3.stackOffsetDiverging, // stack offset method
  order = (series) => { // stack order method; try also d3.stackOffsetNone
    return [ // by default, stack negative series in reverse order
    ...series.map((S, i) => S.some(([, y]) => y < 0) ? i : null).reverse(),
    ...series.map((S, i) => S.some(([, y]) => y < 0) ? null : i)
  ].filter(i => i !== null);
},
xFormat, // a format specifier string for the x-axis
xLabel = undefined, // a label for the x-axis
colors = d3.schemeTableau10, // array of colors
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  
  // Compute default y- and z-domains, and unique them.
  if (yDomain === undefined) yDomain = Y;
  if (zDomain === undefined) zDomain = Z;
  yDomain = new d3.InternSet(yDomain);
  zDomain = new d3.InternSet(zDomain);
  
  // Omit any data not present in the y- and z-domains.
  const I = d3.range(X.length).filter(i => yDomain.has(Y[i]) && zDomain.has(Z[i]));
  
  // If the height is not specified, derive it from the y-domain.
  if (height === undefined) height = yDomain.size * 25 + marginTop + marginBottom;
  if (yRange === undefined) yRange = [height - marginBottom, marginTop];
  
  // Compute a nested array of series where each series is [[x1, x2], [x1, x2],
  // [x1, x2], …] representing the x-extent of each stacked rect. In addition,
  // each tuple has an i (index) property so that we can refer back to the
  // original data point (data[i]). This code assumes that there is only one
  // data point for a given unique y- and z-value.
  const series = d3.stack()
  .keys(zDomain)
  .value(([, I], z) => X[I.get(z)])
  .order(order)
  .offset(offset)
  (d3.rollup(I, ([i]) => i, i => Y[i], i => Z[i]))
  .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));
  
  // Compute the default y-domain. Note: diverging stacks can be negative.
  if (xDomain === undefined) xDomain = d3.extent(series.flat(2));
  
  // Construct scales, axes, and formats.
  const xScale = xType(xDomain, xRange);
  const yScale = d3.scaleBand(yDomain, yRange).paddingInner(yPadding);
  const color = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
  const yAxis = d3.axisLeft(yScale).tickSize(0);
  
  // Compute titles.
  if (title === undefined) {
    const formatValue = xScale.tickFormat(100, xFormat);
    title = i => `${Y[i]}\n${Z[i]}\n${formatValue(X[i])}`;
  } else {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }
  
  const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
  svg.append("g")
  .attr("transform", `translate(0,${marginTop})`)
  .call(xAxis)
  .call(g => g.select(".domain").remove())
  .call(g => g.selectAll(".tick line").clone()
  .attr("y2", height - marginTop - marginBottom)
  .attr("stroke-opacity", 0.1))
  .call(g => g.append("text")
  .attr("x", xScale(0))
  .attr("y", -22)
  .attr("fill", "currentColor")
  .attr("text-anchor", "middle")
  .text(xLabel));
  
  const bar = svg.append("g")
  .selectAll("g")
  .data(series)
  .join("g")
  .attr("fill", ([{i}]) => color(Z[i]))
  .selectAll("rect")
  .data(d => d)
  .join("rect")
  .attr("x", ([x1, x2]) => Math.min(xScale(x1), xScale(x2)))
  .attr("y", ({i}) => yScale(Y[i]))
  .attr("width", ([x1, x2]) => Math.abs(xScale(x1) - xScale(x2)))
  .attr("height", yScale.bandwidth());
  
  if (title) bar.append("title")
  .text(({i}) => title(i));
  
  svg.append("g")
  .attr("transform", `translate(${xScale(0)},0)`)
  .call(yAxis)
  .call(g => g.selectAll(".tick text")
  .attr("dx", -3)
  .attr("x", y => { // Find the minimum x-value for the corresponding y-value.
    const x = d3.min(series, S => S.find(d => Y[d.i] === y)?.[0]);
    return xScale(x) - xScale(0);
  }));
  
  return Object.assign(svg.node(), {scales: {color}});
}
export function BarChart(data, {
  x = (d, i) => i, // given d in data, returns the (ordinal) x-value
  y = d => d, // given d in data, returns the (quantitative) y-value
  marginTop = 20, // the top margin, in pixels
  marginRight = 0, // the right margin, in pixels
  marginBottom = 30, // the bottom margin, in pixels
  marginLeft = 40, // the left margin, in pixels
  width = 640, // the outer width of the chart, in pixels
  height = 400, // the outer height of the chart, in pixels
  xDomain, // an array of (ordinal) x-values
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  xPadding = 0.1, // amount of x-range to reserve to separate bars
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  color = "currentColor", // bar fill color
  duration: initialDuration = 250, // transition duration, in milliseconds
  delay: initialDelay = (_, i) => i * 20 // per-element transition delay, in milliseconds
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  
  // Compute default domains, and unique the x-domain.
  if (xDomain === undefined) xDomain = X;
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  xDomain = new d3.InternSet(xDomain);
  
  // Omit any data not present in the x-domain.
  const I = d3.range(X.length).filter(i => xDomain.has(X[i]));
  
  // Construct scales, axes, and formats.
  const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
  const format = yScale.tickFormat(100, yFormat);
  
  const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
  const yGroup = svg.append("g")
  .attr("transform", `translate(${marginLeft},0)`)
  .call(yAxis)
  .call(g => g.select(".domain").remove())
  .call(g => g.selectAll(".tick").call(grid))
  .call(g => g.append("text")
  .attr("x", -marginLeft)
  .attr("y", 10)
  .attr("fill", "currentColor")
  .attr("text-anchor", "start")
  .text(yLabel));
  
  let rect = svg.append("g")
  .attr("fill", color)
  .selectAll("rect")
  .data(I)
  .join("rect")
  .property("key", i => X[i]) // for future transitions
  .call(position, i => xScale(X[i]), i => yScale(Y[i]))
  .style("mix-blend-mode", "multiply")
  .call(rect => rect.append("title")
  .text(i => [X[i], format(Y[i])].join("\n")));
  
  const xGroup = svg.append("g")
  .attr("transform", `translate(0,${height - marginBottom})`)
  .call(xAxis);
  
  // A helper method for updating the position of bars.
  function position(rect, x, y) {
    return rect
    .attr("x", x)
    .attr("y", y)
    .attr("height", typeof y === "function" ? i => yScale(0) - y(i) : i => yScale(0) - y)
    .attr("width", xScale.bandwidth());
  }
  
  // A helper method for generating grid lines on the y-axis.
  function grid(tick) {
    return tick.append("line")
    .attr("class", "grid")
    .attr("x2", width - marginLeft - marginRight)
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1);
  }
  
  // Call chart.update(data, options) to transition to new data.
  return Object.assign(svg.node(), {
    update(data, {
      xDomain, // an array of (ordinal) x-values
      yDomain, // [ymin, ymax]
      duration = initialDuration, // transition duration, in milliseconds
      delay = initialDelay // per-element transition delay, in milliseconds
    } = {}) {
      // Compute values.
      const X = d3.map(data, x);
      const Y = d3.map(data, y);
      
      // Compute default domains, and unique the x-domain.
      if (xDomain === undefined) xDomain = X;
      if (yDomain === undefined) yDomain = [0, d3.max(Y)];
      xDomain = new d3.InternSet(xDomain);
      
      // Omit any data not present in the x-domain.
      const I = d3.range(X.length).filter(i => xDomain.has(X[i]));
      
      // Update scale domains.
      xScale.domain(xDomain);
      yScale.domain(yDomain);
      
      // Start a transition.
      const t = svg.transition().duration(duration);
      
      // Join the data, applying enter and exit.
      rect = rect
      .data(I, function(i) { return this.tagName === "rect" ? this.key : X[i]; })
      .join(
        enter => enter.append("rect")
        .property("key", i => X[i]) // for future transitions
        .call(position, i => xScale(X[i]), yScale(0))
        .style("mix-blend-mode", "multiply")
        .call(enter => enter.append("title")),
        update => update,
        exit => exit.transition(t)
        .delay(delay)
        .attr("y", yScale(0))
        .attr("height", 0)
        .remove()
        );
        
        // Update the title text on all entering and updating bars.
        rect.select("title")
        .text(i => [X[i], format(Y[i])].join("\n"));
        
        // Transition entering and updating bars to their new position. Note
        // that this assumes that the input data and the x-domain are in the
        // same order, or else the ticks and bars may have different delays.
        rect.transition(t)
        .delay(delay)
        .call(position, i => xScale(X[i]), i => yScale(Y[i]));
        
        // Transition the x-axis (using a possibly staggered delay per tick).
        xGroup.transition(t)
        .call(xAxis)
        .call(g => g.selectAll(".tick").delay(delay));
        
        // Transition the y-axis, then post process for grid lines etc.
        yGroup.transition(t)
        .call(yAxis)
        .selection()
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick").selectAll(".grid").data([,]).join(grid));
      }
    });
}