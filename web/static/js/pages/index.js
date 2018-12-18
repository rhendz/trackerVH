$(function () {
    //Widgets count
    $('.count-to').countTo();

    //Sales count to
    $('.sales-count-to').countTo({
        formatter: function (value, options) {
            return '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, ' ').replace('.', ',');
        }
    });

    // initRealTimeChart();
    initDonutChart();
    initSparkline();
    createBarGraph();
});

var realtime = 'on';
function initRealTimeChart() {
    //Real time ==========================================================================================
    var plot = $.plot('#real_time_chart', [getRandomData()], {
        series: {
            shadowSize: 0,
            color: 'rgb(0, 188, 212)'
        },
        grid: {
            borderColor: '#f3f3f3',
            borderWidth: 1,
            tickColor: '#f3f3f3'
        },
        lines: {
            fill: true
        },
        yaxis: {
            min: 0,
            max: 100
        },
        xaxis: {
            min: 0,
            max: 100
        }
    });

    function updateRealTime() {
        plot.setData([getRandomData()]);
        plot.draw();

        var timeout;
        if (realtime === 'on') {
            timeout = setTimeout(updateRealTime, 320);
        } else {
            clearTimeout(timeout);
        }
    }

    updateRealTime();

    $('#realtime').on('change', function () {
        realtime = this.checked ? 'on' : 'off';
        updateRealTime();
    });
    //====================================================================================================
}

function initSparkline() {
    $(".sparkline").each(function () {
        var $this = $(this);
        $this.sparkline('html', $this.data());
    });
}

function initDonutChart() {
    Morris.Donut({
        element: 'donut_chart',
        data: [{
            label: 'Protein',
            value: 33
        }, {
            label: 'Carbs',
            value: 33
        }, {
            label: 'Fats',
            value: 33
        }],
        colors: ['rgb(233, 30, 99)', 'rgb(0, 188, 212)', 'rgb(255, 152, 0)', 'rgb(0, 150, 136)', 'rgb(96, 125, 139)'],
        formatter: function (y) {
            return y + '%'
        }
    });
}

var data = [], totalPoints = 110;
function getRandomData() {
    if (data.length > 0) data = data.slice(1);

    while (data.length < totalPoints) {
        var prev = data.length > 0 ? data[data.length - 1] : 50, y = prev + Math.random() * 10 - 5;
        if (y < 0) { y = 0; } else if (y > 100) { y = 100; }

        data.push(y);
    }

    var res = [];
    for (var i = 0; i < data.length; ++i) {
        res.push([i, data[i]]);
    }

    return res;
}

function createBarGraph(){
  var ctx = document.getElementById("myChart").getContext('2d');
  ctx.canvas.height = 400;
  ctx.canvas.width = 1000;
  var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: ["10/26/2018" ,"10/27/2018", "10/28/2018", "10/29/2018", "10/30/2018", "11/1/2018", "11/2/2018"],
              datasets: [{
                  label: '# of Calories',
                  data: [1222, 1700, 1900, 500, 2000, 3200, 1500],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              }
          }
      });
}
