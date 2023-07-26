function trend(opt){
  const svg = d3.select('#svg_1');
  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const graph = data => {

    const xValue = d => d.Year;
    const yValue = d => d.Total_Application;
    const margin = ({top: 100, right: 450, bottom: 100, left: 450})
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const x = d3.scaleBand()
      .domain(data.map(d => d.Year))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Total_Application)])
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform',`translate(${margin.left},${margin.top})`)

    const yAxis = d3.axisLeft(y)
      .ticks(8)
      .tickFormat(d3.format('.2s'));

    g.append('g').call(yAxis);

    const xAxis = g.append('g').call(d3.axisBottom(x))
      .attr('transform',`translate(0,${innerHeight})`);

    xAxis.selectAll('.tick line').remove();

    xAxis.append('text')
      .attr('class','axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', 50)
        .text('Fiscal Year');

    g.selectAll('rect').data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(xValue(d)))
      .attr('y', d => y(yValue(d)))
      .attr('width',x.bandwidth())
      .attr('height',d => innerHeight - y(yValue(d)))
      .attr('fill', d => color(xValue(d)));
      
    g.append('text')
      .attr('class','axis-label')
      .attr('y', -30)
      .text('H1B Application Trends for Fiscal Year 2021, 2022 and 2023');
    
    g.selectAll(".label")
      .data(data)
      .enter().append("text")
      .attr("x", d => x(xValue(d)) + x.bandwidth()/2)
      .attr("y", d => y(yValue(d)) + 20)
      .attr("dy", ".35em")
      .attr('text-anchor','middle')
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style('fill', 'white')
      .text(d => d.Total_Application);
  };

  data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/trend.csv").then(data =>{
    data.forEach(d => {
      d.Total_Application = +d.Total_Application
    });
    graph(data)
  });


}

function topEmp(opt) {

    const titleText = 'Top 10 Employers';
    const xAxisLabelText = 'Total Applications';
    const svg = d3.select('#svg_2');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const margin = ({top: 30, right: 20, bottom: 10, left: 225})

    const render = data => {
    const xValue = d => d['Total_Application'];
    const yValue = d => d.Employer_Name;
    const margin = ({top: 30, right: 20, bottom: 10, left: 250})
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const xScale = d3.scaleLinear()
      .domain([0, 16000])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleBand()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.05);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xAxisTickFormat = number =>
      d3.format('.2s')(number);
    
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(xAxisTickFormat)
      .tickSize(-innerHeight);
    
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('.domain, .tick line')
        .remove();
    
    const xAxisG = g.append('g').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxisG.select('.domain').remove();
    
    xAxisG.append('text').data(data)
        .attr('class', 'axis-label')
        .attr('y', 65)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabelText);
    
    g.selectAll('rect').data(data)
      .enter().append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height', yScale.bandwidth())
        .attr('fill',d => color(yValue(d)));
    
    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .attr('x', -100)
        .text(titleText);

    g.selectAll(".label")
        .data(data)
        .enter().append("text")
        .attr("x", d => xScale(xValue(d)) - 20)
        .attr("y", d => yScale(yValue(d)) + yScale.bandwidth()/2)
        .attr("dy", ".35em")
        .attr('text-anchor','middle')
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style('fill', 'white')
        .text(d => d.Total_Application);
  };



   svg.selectAll("*").remove();

    if (opt == 21 ){
         data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/emp_2021.csv").then(data => {
            render(data);
         });
    
    } else if (opt == 22){
         data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/emp_2022.csv").then(data => {
            render(data);
         });
    } else if (opt == 23){
         data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/emp_2023.csv").then(data => {
            render(data);
         });
    }  
}    

function topHireState(opt){

   const titleText = 'Top 10 Hiring US States';
   const xAxisLabelText = 'Total Applications';
   const svg = d3.select('#svg_3');
   const width = +svg.attr('width');
   const height = +svg.attr('height');
   const margin = ({top: 30, right: 20, bottom: 10, left: 225})

   const render = data => {
   const xValue = d => d['Total_Application'];
   const yValue = d => d.State;
   const margin = ({top: 30, right: 20, bottom: 10, left: 250})
   const innerWidth = width - margin.left - margin.right;
   const innerHeight = height - margin.top - margin.bottom;
   const color = d3.scaleOrdinal(d3.schemeCategory10)

   const xScale = d3.scaleLinear()
     .domain([0, 55000])
     .range([0, innerWidth]);
   
   const yScale = d3.scaleBand()
     .domain(data.map(yValue))
     .range([0, innerHeight])
     .padding(0.1);
   
   const g = svg.append('g')
     .attr('transform', `translate(${margin.left},${margin.top})`);
   
   const xAxisTickFormat = number =>
     d3.format('.2s')(number);
   
   const xAxis = d3.axisBottom(xScale)
     .tickFormat(xAxisTickFormat)
     .tickSize(-innerHeight);
   
   g.append('g')
     .call(d3.axisLeft(yScale))
     .selectAll('.domain, .tick line')
       .remove();
   
   const xAxisG = g.append('g').call(xAxis)
     .attr('transform', `translate(0,${innerHeight})`);
   
   xAxisG.select('.domain').remove();
   
   xAxisG.append('text')
       .attr('class', 'axis-label')
       .attr('y', 65)
       .attr('x', innerWidth / 2)
       .attr('fill', 'black')
       .text(xAxisLabelText);
   
   g.selectAll('rect').data(data)
     .enter().append('rect')
       .attr('y', d => yScale(yValue(d)))
       .attr('width', d => xScale(xValue(d)))
       .attr('height', yScale.bandwidth())
       .attr('fill',d => color(yValue(d)));

   g.append('text')
       .attr('class', 'title')
       .attr('y', -10)
       .attr('x', -100)
       .text(titleText);

    g.selectAll(".label")
       .data(data)
       .enter().append("text")
       .attr("x", d => xScale(xValue(d)) - 20)
       .attr("y", d => yScale(yValue(d)) + yScale.bandwidth()/2)
       .attr("dy", ".35em")
       .attr('text-anchor','middle')
       .style("font-family", "sans-serif")
       .style("font-size", "10px")
       .style("font-weight", "bold")
       .style('fill', 'white')
       .text(d => d.Total_Application);
   };     

   svg.selectAll("*").remove();

    if (opt == 31 ){
      data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/state_2021.csv").then(data => {
         render(data);
      });
 
    } else if (opt == 32){
        data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/state_2022.csv").then(data => {
           render(data);
      });
    } else if (opt == 33){
        data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/state_2023.csv").then(data => {
           render(data);
      });
    }  
}

function topHireLoc(opt){

   const titleText = 'Top 10 Hiring US Location';
   const xAxisLabelText = 'Total Applications';
   const svg = d3.select('#svg_4');
   const width = +svg.attr('width');
   const height = +svg.attr('height');
   const margin = ({top: 30, right: 20, bottom: 10, left: 225})

   const render = data => {
   const xValue = d => d['Total_Application'];
   const yValue = d => d.City_Name;
   const margin = ({top: 30, right: 20, bottom: 10, left: 250})
   const innerWidth = width - margin.left - margin.right;
   const innerHeight = height - margin.top - margin.bottom;
   const color = d3.scaleOrdinal(d3.schemeCategory10)

   const xScale = d3.scaleLinear()
     .domain([0, 20000])
     .range([0, innerWidth]);
   
   const yScale = d3.scaleBand()
     .domain(data.map(yValue))
     .range([0, innerHeight])
     .padding(0.1);
   
   const g = svg.append('g')
     .attr('transform', `translate(${margin.left},${margin.top})`);
   
   const xAxisTickFormat = number =>
     d3.format('.2s')(number);
   
   const xAxis = d3.axisBottom(xScale)
     .tickFormat(xAxisTickFormat)
     .tickSize(-innerHeight);
   
   g.append('g')
     .call(d3.axisLeft(yScale))
     .selectAll('.domain, .tick line')
       .remove();
   
   const xAxisG = g.append('g').call(xAxis)
     .attr('transform', `translate(0,${innerHeight})`);
   
   xAxisG.select('.domain').remove();
   
   xAxisG.append('text')
       .attr('class', 'axis-label')
       .attr('y', 65)
       .attr('x', innerWidth / 2)
       .attr('fill', 'black')
       .text(xAxisLabelText);
   
   g.selectAll('rect').data(data)
     .enter().append('rect')
       .attr('y', d => yScale(yValue(d)))
       .attr('width', d => xScale(xValue(d)))
       .attr('height', yScale.bandwidth())
       .attr('fill',d => color(yValue(d)));

   g.append('text')
       .attr('class', 'title')
       .attr('y', -10)
       .attr('x', -100)
       .text(titleText);

    g.selectAll(".label")
       .data(data)
       .enter().append("text")
       .attr("x", d => xScale(xValue(d)) - 20)
       .attr("y", d => yScale(yValue(d)) + yScale.bandwidth()/2)
       .attr("dy", ".35em")
       .attr('text-anchor','middle')
       .style("font-family", "sans-serif")
       .style("font-size", "10px")
       .style("font-weight", "bold")
       .style('fill', 'white')
       .text(d => d.Total_Application);
   };     

   svg.selectAll("*").remove();

    if (opt == 41 ){
      data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/place_2021.csv").then(data => {
         render(data);
      });
 
    } else if (opt == 42){
        data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/place_2022.csv").then(data => {
           render(data);
      });
    } else if (opt == 43){
        data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/place_2023.csv").then(data => {
           render(data);
      });
    }      
}