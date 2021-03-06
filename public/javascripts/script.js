$(document).ready(function(){

  var graphType
  var model
  $("#submit").click(function(){
    model = $("#model").val()
    var groupby = $("#groupby").val()
    graphType = $("#typeOfGraph").val()
    getData(model, groupby)
  })

  function getData(model, groupby){
    var labels = []
    var quantity = []
    $("#count-table").html('')
    $.get(`/api/data?model=${model}&groupby=${groupby}`, function(data){
      createCanvasElement(model, groupby);
      var increment = 0
      $("#table").append("<table class='table table-striped' id='count-table'></table>")
      $("#count-table").append("<thead id='thead-div'></thead>")
      $("#thead-div").append("<tr id='header'></tr>")
      $("#header").append(`<th>${groupby}</th>`)
      $("#header").append("<th>Quantity</th>")
      $("#count-table").append("<tbody id='tbody-div'></tbody>")
      data.forEach(function(row){
        $("#tbody-div").append("<tr id='row-" + increment + "'></tr>")
        $("#row-" + increment).append("<th>" + row[groupby] + "</th>")
        $("#row-" + increment).append("<th>" + row.count +"</th>")
        increment++
        labels.push(row[groupby])
        quantity.push(row['count'])
      })
      createChart($('#myChart'), labels, quantity, model, groupby);
    });
  }

  function createCanvasElement(model, numberOf) {
    $('#canvas-div').html('');
    $('#canvas-div').append(`<h4 class='text-center' id='bar-title'>${model}s by ${numberOf}</h4>`)
    $('#canvas-div').append('<canvas id="myChart" width="400" height="400"></canvas>')
    $('#canvas-div').append('<canvas id="myPieChart" width="400" height="400"></canvas>')
  }

  function createChart(element, labels, quantity, model, numberOf) {

    var myPieChart = new Chart($('#myPieChart'),{
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            data: quantity,
            backgroundColor: backgroundColorsArray(labels),
            borderColor: borderColorsArray(labels),
            borderWidth: 1
        }]
    }

  });
    var myChart = new Chart(element, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: model + 's by ' + numberOf,
                data: quantity,
                backgroundColor: backgroundColorsArray(labels),
                borderColor: borderColorsArray(labels),
                borderWidth: 1
            }]
        },
        options: {
          legend: {
            display: false
          },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
    showGraph(graphType)
  };

  function randomColor() {
    return Math.floor(Math.random() * 256);
  }

  function backgroundColorsArray(labels) {
    var array = [];
    for (var i=0; i<labels.length; i++) {
      array.push(`rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.5)`);
    }
    return array;
  }

  function borderColorsArray(labels) {
    var array = [];
    for (var i=0; i<labels.length; i++) {
      array.push(`rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 1)`);
    }
    return array;
  }

  function populateDropDown(){
    $("#model").empty();
    $("#model").prepend("<option value='Choose table'>Choose your table</option>");
    $("#groupby").prepend("<option value='Choose table'>Choose your attribute</option>");
    $.get('api/data/tables', function(data){
      data.forEach(function(model){
        $("#model").append(`<option value='${model.split('.')[0]}'>${model.split('.')[0]}</option>`)
      });
    });
  };

  populateDropDown();

  function showGraph(graph){
    var allGraphs = []
    var classes = document.getElementsByClassName("graph");
    console.log(classes)
      for (i = 0; i < classes.length; i++){
        allGraphs.push(classes[i].value)
      }
    allGraphs.forEach(function(x){
        $(`#${x}`).hide()
    });
    $(`#${graph}`).show()
  };


  $("#model").change(function(){
    model = $("#model").val()
    $('#groupby').html('')
    $("#groupby").prepend("<option value='Choose table'>Choose your attribute</option>");
    $.get(`/api/data/columns?model=${model}`, function(data){
      data.forEach(function(column){
        $("#groupby").append(`<option value='${column}'>${column}</option>`)
      });
    })
  });
});
