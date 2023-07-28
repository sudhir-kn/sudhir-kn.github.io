function trend(opt){
  const svg = d3.select('#svg_1');
  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const graph = data => {

    const xValue = d => d.Year;
    const yValue = d => d.Total_Application;
    const margin = ({top: 100, right: 300, bottom: 100, left: 300})
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const x = d3.scaleBand()
      .domain(data.map(xValue))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, yValue)])
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform',`translate(${margin.left},${margin.top})`)

    const yAxis = d3.axisLeft(y)
      .ticks(8)
      .tickFormat(d3.format('.2s'));

    g.append('g').call(yAxis)
      .append('text')
      .attr('class','axis-label')
      .attr("transform", "rotate(-90)")
      .attr('x', -120)
      .attr('y', -65)
      .attr('fill','black')
      .attr("text-anchor", "end")
      .text('Total Applications');

    const xAxis = g.append('g').call(d3.axisBottom(x))
      .attr('transform',`translate(0,${innerHeight})`);

    xAxis.append('text')
      .attr('class','axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', 50)
      .text('Fiscal Year');

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('d', d3.line()
        .x(d => x(xValue(d)) + x.bandwidth()/2)
        .y(d => y(yValue(d)))
        );

    g.append('g')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(xValue(d)))
      .attr('cy', d => y(yValue(d)))
      .attr('r', 4)
      .attr('transform', `translate(${x.bandwidth()/2},0)`)
      .style('fill', d => color(xValue(d)))
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut);

    g.append('text')
      .attr('class','axis-label')
      .attr('y', -30)
      .text('H1B Application Trends for Fiscal Year 2021, 2022 and 2023');

    const annotations = [
      {
        note: {
          label: 'Declining',
          title: 'Trend: '
        },
        connector: {
          end: 'arrow',        
          type: 'curve',       
          points: 3,           
          lineType : 'horizontal'
        },
        color: ['red'],
        x: 680,
        y: 180,
        dy: 70,
        dx: 150
      }
    ]
      
    const makeAnnotations = d3.annotation()
        .annotations(annotations);

    d3.select('#svg_1')
        .append('g')
        .call(makeAnnotations);

    d3.select('#svg_1').selectAll('.connector')
        .attr('stroke', 'blue')
        .style('stroke-dasharray', ('3, 3'));

    d3.select('#svg_1').selectAll('.connector-end')
        .attr('stroke', 'blue')
        .attr('fill', 'blue');

    const annotations_2 = [
      {
        note: {
          label: 'Hover over the data points to know no. of applications'
        },
        color: ['steelblue'],
        x: 900,
        y: 100
      }
    ]
          
    const makeAnnotations_2 = d3.annotation()
        .annotations(annotations_2);
    
    d3.select('#svg_1')
        .append('g')
        .style('font-size', '11px')
        .call(makeAnnotations_2);
    
    function onMouseOver(d, i) {

      var xPos = parseFloat(event.pageX);
      var yPos = parseFloat(event.pageY);

      d3.select('#tooltip')
          .style('left', (xPos + 15) + 'px')
          .style('top', (yPos + 15) + 'px')
          .html("<p style='font-family:sans-serif; font-size:12px'> <strong>Fiscal Year: </strong>" + d.Year + "<br>" + "<strong>Total Applications: </strong>" + d.Total_Application+ "</p>");
        
      d3.select('#tooltip').classed('hidden', false);
      
      d3.select(this)
          .attr('opacity', '0.85')
          .style('fill','red')
          .attr('cx', d => x(xValue(d)) + 2)
          .attr('cy', d => y(yValue(d)) + 2)
          .attr('r', 6);          
    }
      
    function onMouseOut(d, i){
      d3.select(this)
          .attr('opacity', '1.0')
          .style('fill', d => color(xValue(d)))
          .attr('cx', d => x(xValue(d)))
          .attr('cy', d => y(yValue(d)))
          .attr('r', 4);          
      
      d3.select('#tooltip').classed('hidden', true);
    }  
  };

  svg.selectAll('*').remove();

  data = d3.csv('https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/trend.csv').then(data =>{
    data.forEach(d => {
      d.Total_Application = +d.Total_Application
    });
    graph(data)
  });
  
  document.getElementById('p_trend').innerHTML = 'Overall, there is a decline in the number of H1B applications starting FY 2022. This may be due to lockdown, closure of government offices, travel bans (Presidential Proclamation) and other restrictions imposed during the second wave of Covid 19. Also, further decline during FY 2023 may be due to not having the complete data when this dataset was made available.<br> Click <strong>"Next"</strong> to know the top Employers who have sponsered H1B visa.'
}

function topEmp(opt) {

    const svg = d3.select('#svg_2');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const render = data => {
    const xValue = d => d.Total_Application;
    const yValue = d => d.Employer_Name;
    const margin = ({top: 50, right: 20, bottom: 50, left: 300})
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const x = d3.scaleLinear()
      .domain([0, 16000])
      .range([0, innerWidth]);
    
    const y = d3.scaleBand()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.05);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xAxisTickFormat = number =>
      d3.format('.2s')(number);
    
    const xAxis = d3.axisBottom(x)
      .tickFormat(xAxisTickFormat)
      .tickSize(-innerHeight);
    
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('.domain, .tick line')
        .remove();
    
    const xAxisG = g.append('g').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxisG.select('.domain').remove();
    
    xAxisG.append('text').data(data)
        .attr('class', 'axis-label')
        .attr('y', 40)
        .attr('x', innerWidth / 2)
        .text('Total Applications');
    
    g.selectAll('rect').data(data)
      .enter().append('rect')
        .attr('y', d => y(yValue(d)))
        .attr('width', d => x(xValue(d)))
        .attr('height', y.bandwidth())
        .attr('fill',d => color(yValue(d)))
        .on('mouseover', function(){d3.select(this).attr('opacity', '0.85');})
        .on('mouseout', function(){d3.select(this).attr('opacity', '1.0');});
    
    g.append('text')
      .attr('class','axis-label')
      .attr('y', -20)
      .text('Top 10 Employers sponsoring H1B');

    g.selectAll('.label')
        .data(data)
        .enter().append('text')
        .attr('x', d => x(xValue(d)) - 20)
        .attr('y', d => y(yValue(d)) + y.bandwidth()/2)
        .attr('dy', '.35em')
        .attr('text-anchor','middle')
        .style('font-family', 'sans-serif')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .style('fill', 'white')
        .text(d => d.Total_Application);
  };

  svg.selectAll('*').remove();

  if (opt == 21 ){
      data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/emp_2021.csv").then(data => {
        render(data);
      });
      document.getElementById('p_topemp').innerHTML = 'Above are the top 10 Employers who have sponsered H1B application during the FY 2021. Majority of them are Consulting Firms. <br> Click <strong>"Next"</strong> to know the state wise H1B opportunities.'
    } else if (opt == 22){
        data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/emp_2022.csv").then(data => {
         render(data);
      });
      document.getElementById('p_topemp').innerHTML = 'Above are the top 10 Employers who have sponsered H1B application during the FY 2022.  Majority of them are Consulting Firms.<br> Click <strong>"Next"</strong> to know the state wise H1B opportunities.'
    } else if (opt == 23){
        data = d3.csv("https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/emp_2023.csv").then(data => {
          render(data);
      });
      document.getElementById('p_topemp').innerHTML = 'Above are the top 10 Employers who have sponsered H1B application during the FY 2023.  Majority of them are Consulting Firms.<br> Click <strong>"Next"</strong> to know the state wise H1B opportunities.'
    }  
}    

function topHireState(opt){

    const svg = d3.select('#svg_3');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const render = data => {
   
      const xValue = d => d.Total_Application;
      const yValue = d => d.State;
      const margin = ({top: 50, right: 20, bottom: 50, left: 300})
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const color = d3.scaleOrdinal(d3.schemeCategory10)

      const x = d3.scaleLinear()
        .domain([0, 55000])
        .range([0, innerWidth]);
   
      const y = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.05);
   
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
   
      const xAxisTickFormat = number =>
        d3.format('.2s')(number);
   
      const xAxis = d3.axisBottom(x)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight);
   
      g.append('g')
        .call(d3.axisLeft(y))
        .selectAll('.domain, .tick line')
          .remove();
   
      const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`);
   
      xAxisG.select('.domain').remove();
   
      xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 40)
        .attr('x', innerWidth / 2)
        .text('Total Applications');
   
      g.selectAll('rect').data(data)
        .enter().append('rect')
        .attr('y', d => y(yValue(d)))
        .attr('width', d => x(xValue(d)))
        .attr('height', y.bandwidth())
        .attr('fill',d => color(yValue(d)))
        .on('mouseover', function(){d3.select(this).attr('opacity', '0.85');})
        .on('mouseout', function(){d3.select(this).attr('opacity', '1.0');});

      g.append('text')
        .attr('class','axis-label')
        .attr('y', -20)
        .text('Top 10 US states with H1B job opportunities');

      g.selectAll('.label')
        .data(data)
        .enter().append('text')
        .attr('x', d => x(xValue(d)) - 20)
        .attr('y', d => y(yValue(d)) + y.bandwidth()/2)
        .attr('dy', '.35em')
        .attr('text-anchor','middle')
        .style('font-family', 'sans-serif')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .style('fill', 'white')
        .text(d => d.Total_Application);
    };     

    svg.selectAll('*').remove();

    if (opt == 31 ){
      data = d3.csv('https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/state_2021.csv').then(data => {
        render(data);
      });
      document.getElementById('p_topstate').innerHTML = 'Above are the top 10 state wise H1B opportunities during the FY 2021. <br> Click <strong>"Next"</strong> to know the location wise H1B opportunities.'
    } else if (opt == 32){
        data = d3.csv('https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/state_2022.csv').then(data => {
          render(data);
        });
        document.getElementById('p_topstate').innerHTML = 'Above are the top 10 state wise H1B opportunities during the FY 2022. <br> Click <strong>"Next"</strong> to know the location wise H1B opportunities.'
    } else if (opt == 33){
        data = d3.csv('https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/state_2023.csv').then(data => {
          render(data);
        });
        document.getElementById('p_topstate').innerHTML = 'Above are the top 10 state wise H1B opportunities during the FY 2023. <br> Click <strong>"Next"</strong> to know the location wise H1B opportunities.'
    }  
}

function topHireLoc(opt){

    const svg = d3.select('#svg_4');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const render = data => {
      const xValue = d => d.Total_Application;
      const yValue = d => d.City_Name;
      const margin = ({top: 50, right: 20, bottom: 50, left: 300})
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const color = d3.scaleOrdinal(d3.schemeCategory10)

      const x = d3.scaleLinear()
        .domain([0, 20000])
        .range([0, innerWidth]);
   
      const y = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.05);
   
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
   
      const xAxisTickFormat = number =>
          d3.format('.2s')(number);
   
      const xAxis = d3.axisBottom(x)
          .tickFormat(xAxisTickFormat)
          .tickSize(-innerHeight);
   
      g.append('g')
          .call(d3.axisLeft(y))
          .selectAll('.domain, .tick line')
            .remove();
   
      const xAxisG = g.append('g').call(xAxis)
          .attr('transform', `translate(0,${innerHeight})`);
   
      xAxisG.select('.domain').remove();
   
      xAxisG.append('text').data(data)
        .attr('class', 'axis-label')
        .attr('y', 40)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text('Total Applications');
   
      g.selectAll('rect').data(data)
        .enter().append('rect')
          .attr('y', d => y(yValue(d)))
          .attr('width', d => x(xValue(d)))
          .attr('height', y.bandwidth())
          .attr('fill',d => color(yValue(d)))
          .on('mouseover', function(){d3.select(this).attr('opacity', '0.85');})
          .on('mouseout', function(){d3.select(this).attr('opacity', '1.0');});

      g.append('text')
        .attr('class','axis-label')
        .attr('y', -20)
        .text('Top 10 US Locations with H1B job opportunities');
 
      g.selectAll('.label')
        .data(data)
        .enter().append('text')
        .attr('x', d => x(xValue(d)) - 20)
        .attr('y', d => y(yValue(d)) + y.bandwidth()/2)
        .attr('dy', '.35em')
        .attr('text-anchor','middle')
        .style('font-family', 'sans-serif')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .style('fill', 'white')
        .text(d => d.Total_Application);
    };     

    svg.selectAll('*').remove();

    if (opt == 41 ){
      data = d3.csv('https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/place_2021.csv').then(data => {
        render(data);
      });
      document.getElementById('p_tophireloc').innerHTML = 'Above are the top 10 location wise H1B opportunities during the FY 2021. <br> Click <strong>"Back to Main"</strong> to return to the main page or close (x) at the the top of the window to exit.'
    } else if (opt == 42){
        data = d3.csv('https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/place_2022.csv').then(data => {
          render(data);
      });
      document.getElementById('p_tophireloc').innerHTML = 'Above are the top 10 location wise H1B opportunities during the FY 2021. <br> Click <strong>"Back to Main"</strong> to return to the main page or close (x) at the the top of the window to exit.'
    } else if (opt == 43){
        data = d3.csv('https://raw.githubusercontent.com/sudhir-kn/Narrative_Visualization/main/data/place_2023.csv').then(data => {
          render(data);
      });
      document.getElementById('p_tophireloc').innerHTML = 'Above are the top 10 location wise H1B opportunities during the FY 2021. <br> Click <strong>"Back to Main"</strong> to return to the main page or close (x) at the the top of the window to exit.'
    }      
}
