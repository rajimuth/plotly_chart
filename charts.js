var globalData;
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    globalData = data;
    console.log(data);
    var sampleNames = data.names;
    console.log("sampleName[0]:" + sampleNames[0]);

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    console.log("first Sample:" + firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
// Initialize the dashboard
init();

function optionChanged(newSample) {
  console.log("First sample");
  console.log(newSample);
// Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
 }

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
// Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
//Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

//Use `.html("") to clear any existing metadata
    PANEL.html("");

// Use `Object.entries` to add each key and value pair to the panel
// Hint: Inside the loop, you will need to use d3 to append new
// tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
// 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
// 3. Create a variable that holds the samples array. 
  var samples = data.samples;
  // console.log("data.samples:"+ samples);
 // 4. Create a variable that filters the samples for the object with the desired sample number.
  var chartArray =samples.filter(sampleObj => sampleObj.id == sample);
  // console.log("chart Array:" + chartArray);

   // 1. Create a variable that filters the metadata array for the object with the desired sample number.

   var dMetadata = data.metadata;
   console.log("wfre" + dMetadata);

   // 2. Create a variable that holds the first sample in the metadata array.
    var mdataWfre = dMetadata[0];

// 5. Create a variable that holds the first sample in the array.
  var result =chartArray[0];
  console.log("result" + result);

//  6. Create variables that hold the otu_ids, otu_labels, and sample_values.
  var otuIds = result.otu_ids;
  console.log ("otuIds:"+otuIds);

  var otuLabels = result.otu_labels;
  console.log("otuLabels:" + otuLabels);

  var sampleValues=result.sample_values;
  console.log("sampleValues:" + sampleValues);
  
  // 3. Create a variable that holds the washing frequency.
   var wfreq=mdataWfre.wfreq;


    
// 7. Create the yticks for the bar chart.
// Hint: Get the the top 10 otu_ids and map them in descending order  
//  so the otu_ids with the most bacteria are last. 
   var sortedSamval= sampleValues.slice(0,10);
   var samVal = sortedSamval.reverse();
// console.log ("sorted sample value"+ samVal);
  var yticks=otuIds.slice(0,10).map(ID => 'OTU' + " "+ ID).reverse();
  // var yticks = yLab.sort((a,b)=> a-b).reverse();
  // var yLabels = ["OTU 2859","OTU 2318","OTU 2264","OTU 1977","OTU 1189","OTU 1167","OTU 482","OTU 352","OTU 189","OTU 41"];
  // // console.log("yticks"+ yticks);
 
//     // 8. Create the trace for the bar chart. 
  var barData = {
    x: samVal,
    y: yticks,
    type:"bar",
    orientation: 'h'     
  };
  trace =[barData];
//   9. Create the layout for the bar chart. 
  var layout ={
  title:"Top 10 Bacteria Cultures Found",
  xaxis:{title:"Sample Values"},
  yaxis:{title:"ID's"},
  };
//     // 10. Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar",trace,layout);

  // 1. Create the trace for the bubble chart.
  var bubbleData = [{
    x: otuIds,
    y:sampleValues,
    type:"scatter",
    mode:"markers",
    labels :otuLabels,
    marker : {
      color :otuIds,
      // colorscale: 'Portland',
      // colorscale: 'Jet',
      colorscale: 'Earth',
      size : sampleValues,
      hover:{
        mode:'nearest',
        text: otuLabels
      }     
    }
    // marker = sampleValues
  }];

   // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
  title:"Bacterial Cultures Per Sample",
  xaxis:{title:"OTU ID"}
  
// yaxis:{title:"ID's"}
  };

// 3. Use Plotly to plot the data with the layout.
   Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

   // 4. Create the trace for the gauge chart.
   var gaugeData =[
     {
      domain: { 'x':[0, 1], 'y': [0, 1] },
      values: wfreq,
      value:wfreq,
      mode : "gauge+number+delta",
      title: { text: "Scrubs per Week" },
      delta : {'reference': wfreq, 'increasing': {'color': "cyan"}},
      type: "indicator",
      gauge : { axis: { range: [null, 10] },
      'bar': {'color': "black"},
      'steps' : [{'range':  [0, 2], 'color': "red"},
      {'range': [2, 4], 'color': "orange"},
       {'range': [4, 6], 'color': "yellow"},
       {'range': [6, 8], 'color': "cyan"},
      {'range': [8, 10], 'color': "green"}]}

     }
   ];


  // 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
    title:"Belly Button Washing Frequency"
   
  };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge",gaugeData,gaugeLayout);

  });
}
