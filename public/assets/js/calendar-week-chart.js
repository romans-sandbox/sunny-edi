var calendarWeekChart = function() {
  var module = {};

  var width = 300;
  var height = 200;
  var margins = {
    top: 10,
    right: 10,
    bottom: 25,
    left: 40
  };

  var options = {
    yAxisOffset: -15,
    xAxisOffset: 5,
    durations: {
      lineMorph: 150
    }
  };

  var availWidth = width - margins.left - margins.right;
  var availHeight = height - margins.top - margins.bottom;

  var data;

  var svg, mainGroup;
  var xAxisGroup, yAxisGroup;
  var maxTempLine, minTempLine, zeroLine;

  var formatDate = d3.time.format('%Y-%m-%d');
  var formatWeekDay = d3.time.format('%a');

  var x = d3.time.scale()
    .range([0, availWidth]);

  var xExtended = d3.time.scale()
    .range([options.yAxisOffset, availWidth - options.yAxisOffset]);

  var y = d3.scale.linear()
    .range([availHeight, 0]);

  var xAxis = d3.svg.axis()
    .orient('bottom')
    .ticks(7)
    .tickFormat(formatWeekDay);

  var yAxis = d3.svg.axis()
    .orient('left');

  var lineTempMax = d3.svg.line()
    .interpolate('cardinal')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.max_temp);
    });

  var lineTempMin = d3.svg.line()
    .interpolate('cardinal')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.min_temp);
    });

  var lineZero = d3.svg.line()
    .x(function(d, i) {
      return xExtended(d.date);
    })
    .y(function(d, i) {
      return y(0);
    });

  module.init = function() {
    var tempLimits;

    svg = d3.select('#week-calendar')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', '0 0 ' + width + ' ' + height);

    mainGroup = svg.append('g')
      .attr('class', 'main-group')
      .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

    xAxisGroup = mainGroup.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + (availHeight + options.xAxisOffset) + ')');

    yAxisGroup = mainGroup.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + options.yAxisOffset + ', 0)');

    yAxisGroup
      .append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .text('Temperature (°C)');

    maxTempLine = mainGroup.append('path')
      .attr('class', 'line max-temp');

    minTempLine = mainGroup.append('path')
      .attr('class', 'line min-temp');

    zeroLine = mainGroup.append('path')
      .attr('class', 'line zero');

    tempLimits = datasetsHelper.findMinMaxTempAllLocations();

    y.domain(
      [
        tempLimits.min,
        tempLimits.max
      ]
    );

    yAxis
      .scale(y);

    yAxisGroup
      .call(yAxis);
  };

  module.update = function(weekData) {
    var status;

    status = calendarControls.getStatus();

    // todo find another approach as this one may potentially slow down the overall performance
    data = datasetsHelper.data[status.location + 'Weather' + status.year].map(function(d, i) {
      if (typeof d.date === 'string') {
        d.date = formatDate.parse(d.date);
      }

      d.min_temp = +d.min_temp;
      d.max_temp = +d.max_temp;

      return d;
    }).filter(function(d, i) {
      return d.date > utils.addDaysToDate(new Date(status.year, 0, 0), weekData[0])
        && d.date <= utils.addDaysToDate(new Date(status.year, 0, 0), weekData[1]);
    }).sort(function(a, b) {
      return a.date > b.date;
    });

    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));

    xExtended.domain(d3.extent(data, function(d) {
      return d.date;
    }));

    xAxis
      .ticks(data.length)
      .scale(x);

    xAxisGroup
      .call(xAxis);

    maxTempLine
      .datum(data)
      .transition()
      .duration(options.durations.lineMorph)
      .attr('d', lineTempMax);

    minTempLine
      .datum(data)
      .transition()
      .duration(options.durations.lineMorph)
      .attr('d', lineTempMin);

    zeroLine
      .datum(data)
      .attr('d', lineZero);
  };

  module.show = function() {
    mainGroup.attr('class', 'main-group visible');
  };

  module.hide = function() {
    mainGroup.attr('class', 'main-group');
  };

  module.setSize = function(ratio) {
    svg
      .attr('width', width * ratio)
      .attr('height', height * ratio);
  };

  return module;
}();
