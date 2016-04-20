var calendarChart = function() {
  var module = {};

  var width = 600;
  var height = 600;
  var margins = {
    top: 10,
    right: 20,
    bottom: 10,
    left: 10
  };

  var options = {
    days: 365,
    firstDayOffset: 4,
    circleGroupMargin: 40,
    spokeWidth: 3,
    spokeSunnyLength: 20,
    spokeRainyMaxLength: 100,
    spokeWindyLength: 40,
    weekLineOffset: 5,
    weekLineWidth: 1,
    monthLineOffset: 8,
    monthLineWidth: 2,
    monthWingWidth: 10,
    monthNameOffset: 18,
    weekSliceInnerOffset: 150,
    weekSliceOuterOffset: 25,
    weekSliceTextOffset: 5,
    spokeDashWidth: 10,
    spokeDashSpace: 30,
    windDashDivisor: 10,
    minWindDashCoefficient: 1,
    maxWindDashCoefficient: 30,
    durations: {
      spokeMorph: 500,
      tempWeekSlice: 1000
    }
  };

  // cached queries
  var v = {};

  v.container = document.querySelector('#calendar');

  var availWidth, availHeight;

  var data, tempMaxMin = 0, tempMaxMax = Infinity, precipitationMax = 0, windSpeedMin = 0, windSpeedMax = Infinity;

  // weeks data
  var weeksData = function() {
    var i, result = [], count, from, to;

    if (options.firstDayOffset > 0) {
      result.push([0, options.firstDayOffset, 1]);
    }

    count = Math.ceil(options.days / 7);

    for (i = (options.firstDayOffset > 0 ? 1 : 0); i < count; i++) {
      from = i * 7 - options.firstDayOffset + 1;
      to = (i + 1) * 7 - options.firstDayOffset + 1;

      if (to > options.days) {
        to = options.days;
      }

      result.push([from, to, i + 1]);
    }

    return result;
  }();

  // months data
  var monthsData = [{
    from: 1,
    to: 31
  }, {
    from: 32,
    to: 59
  }, {
    from: 60,
    to: 90
  }, {
    from: 91,
    to: 120
  }, {
    from: 121,
    to: 151
  }, {
    from: 152,
    to: 181
  }, {
    from: 182,
    to: 212
  }, {
    from: 213,
    to: 243
  }, {
    from: 244,
    to: 273
  }, {
    from: 274,
    to: 304
  }, {
    from: 305,
    to: 334
  }, {
    from: 335,
    to: 365
  }];

  var svg, mainGroup;
  var circleGroup, circleGroupRadius;
  var spokesDrawn = false, spokeGroups, spokeGroupsEnter, spokes;
  var weekLines, weekLinesEnter, weekLineArc;
  var monthLines, monthLinesEnter, monthLineArc;
  var monthLeftWings, monthLeftWingsEnter;
  var monthRightWings, monthRightWingsEnter;
  var monthNameGroups, monthNameGroupsEnter;
  var weekSlice, weekSliceArc, weekSliceTimeout;
  var weekNumberLabelGroup, weekNumberLabelText;
  var spokeDashes, spokeDashesDataChanged = false, spokeDashMainGroup, spokeDashGroups, spokeDashGroupsEnter;

  var warmth = d3.scale.linear()
    .range([k.k4, k.k3]);

  var precipitation = d3.scale.linear()
    .range([1, options.spokeRainyMaxLength]);

  var windSpeed = d3.scale.linear()
    .range([options.minWindDashCoefficient, options.maxWindDashCoefficient]);

  function resizeChart() {
    availWidth = width - margins.left - margins.right;
    availHeight = height - margins.top - margins.bottom;

    svg
      .attr('viewBox', '0 0 ' + width + ' ' + height);

    circleGroupRadius = Math.min(availWidth, availHeight) / 2 - options.circleGroupMargin;

    circleGroup
      .attr(
        'transform',
        'translate(' +
        (availWidth / 2) +
        ', ' +
        (availHeight / 2) +
        ')'
      );

    calendarWeekChart.setSize(window.innerHeight / height);
  }

  function sunshine(d, i) {
    if (d.weather_desc === 'Sunny') {
      return warmth(d.max_temp);
    }

    return k.k2;
  }

  function windColor(d, i) {
    var ratio;

    ratio = (d.wind_speed - windSpeedMin) / (windSpeedMax - windSpeedMin);

    if (ratio > 0.8) {
      return k.k3;
    }

    if (ratio > 0.5) {
      return k.k8;
    }

    return k.k7;
  }

  function mapRadiansToDay(rad) {
    var day;

    if (rad < 0) {
      rad += 2 * Math.PI;
    }

    day = Math.floor(rad / (2 * Math.PI) * options.days);

    return day;
  }

  function dayToWeekData(day) {
    var i;

    for (i = 0; i < weeksData.length; i++) {
      if (day > weeksData[i][0] && day <= weeksData[i][1]) {
        return weeksData[i];
      }
    }

    return null;
  }

  function findMinMaxTempAllLocations() {
    var min = Infinity, minTest, max = -Infinity, maxTest, weatherDataKey;

    for (weatherDataKey in datasetsHelper.data) {
      if (datasetsHelper.data.hasOwnProperty(weatherDataKey)) {
        minTest = d3.min(datasetsHelper.data[weatherDataKey], function(d, i) {
          return +d.max_temp;
        });

        if (minTest < min) {
          min = minTest;
        }

        maxTest = d3.max(datasetsHelper.data[weatherDataKey], function(d, i) {
          return +d.max_temp;
        });

        if (maxTest > max) {
          max = maxTest;
        }
      }
    }

    tempMaxMin = min;
    tempMaxMax = max;
  }

  function setWarmthDomain() {
    warmth
      .domain([tempMaxMin, tempMaxMax]);
  }

  function findMaxPrecipitationAllLocations() {
    var max = -Infinity, maxTest, weatherDataKey;

    for (weatherDataKey in datasetsHelper.data) {
      if (datasetsHelper.data.hasOwnProperty(weatherDataKey)) {
        maxTest = d3.max(datasetsHelper.data[weatherDataKey], function(d, i) {
          return +d.precip_mm;
        });

        if (maxTest > max) {
          max = maxTest;
        }
      }
    }

    precipitationMax = max;
  }

  function setPrecipitationDomain() {
    precipitation
      .domain([0, precipitationMax]);
  }

  function findMinMaxWindSpeedAllLocations() {
    var min = Infinity, minTest, max = -Infinity, maxTest, weatherDataKey;

    for (weatherDataKey in datasetsHelper.data) {
      if (datasetsHelper.data.hasOwnProperty(weatherDataKey)) {
        minTest = d3.min(datasetsHelper.data[weatherDataKey], function(d, i) {
          return +d.wind_speed;
        });

        if (minTest < min) {
          min = minTest;
        }

        maxTest = d3.max(datasetsHelper.data[weatherDataKey], function(d, i) {
          return +d.wind_speed;
        });

        if (maxTest > max) {
          max = maxTest;
        }
      }
    }

    windSpeedMin = min;
    windSpeedMax = max;
  }

  function setWindSpeedDomain() {
    windSpeed
      .domain([windSpeedMin, windSpeedMax]);
  }

  function drawSpokes() {
    if (spokesDrawn) {
      return false;
    }

    spokeGroups = circleGroup.selectAll('g.spoke-group').data(data);

    spokeGroupsEnter = spokeGroups.enter()
      .append('g')
      .attr('class', 'spoke-group')
      .attr('transform', function(d, i) {
        return 'rotate(' + (i / options.days * 360) + ')';
      });

    spokes = spokeGroupsEnter
      .append('line')
      .attr('class', 'spoke')
      .attr('x1', circleGroupRadius)
      .attr('y1', 0)
      .attr('x2', circleGroupRadius)
      .attr('y2', 0)
      .style('stroke-width', options.spokeWidth)
      .style('stroke', k.k1);

    spokeDashMainGroup = circleGroup.append('g')
      .attr('class', 'spoke-dash-main-group');

    spokeDashGroups = spokeDashMainGroup.selectAll('g.spoke-dash-group').data(data);

    spokeDashGroupsEnter = spokeDashGroups.enter()
      .append('g')
      .attr('class', 'spoke-dash-group')
      .attr('transform', function(d, i) {
        return 'rotate(' + (i / options.days * 360) + ')';
      });

    spokeDashes = spokeDashGroupsEnter.append('line')
      .attr('class', 'spoke-dash')
      .attr('x1', circleGroupRadius)
      .attr('y1', 0)
      .attr('x2', circleGroupRadius - options.spokeWindyLength)
      .attr('y2', 0)
      .style('stroke-width', options.spokeWidth)
      .style('stroke-dasharray', options.spokeDashWidth + ' ' + options.spokeDashSpace)
      .style('stroke', windColor);

    d3.timer(function(elapsed) {
      /**
       * todo pause timer when spoke dashes not visible
       */

      if (spokeDashesDataChanged) {
        spokeDashes.data(data);
      }

      spokeDashes
        .style('stroke-dashoffset', function(d, i) {
          var self;

          self = d3.select(this);

          return window.parseFloat(self.style('stroke-dashoffset'))
            - windSpeed(d.wind_speed) / options.windDashDivisor;
        });

      spokeDashesDataChanged = false;
    });

    spokesDrawn = true;

    return true;
  }

  function updateSpokesAndDashes(weatherCondition) {
    spokeDashMainGroup
      .attr('class', 'spoke-dash-main-group');

    if (weatherCondition === 'sunny') {
      spokes
        .data(data)
        .transition()
        .duration(options.durations.spokeMorph)
        .attr('x1', circleGroupRadius - options.spokeSunnyLength)
        .style('stroke', sunshine);

      return true;
    }

    if (weatherCondition === 'rainy') {
      spokes
        .data(data)
        .transition()
        .duration(options.durations.spokeMorph)
        .attr('x1', function(d, i) {
          return circleGroupRadius - precipitation(d.precip_mm);
        })
        .style('stroke', k.k7);

      return true;
    }

    if (weatherCondition === 'windy') {
      spokes
        .data(data)
        .transition()
        .duration(options.durations.spokeMorph)
        .attr('x1', circleGroupRadius - options.spokeWindyLength)
        .style('stroke', k.k1);

      spokeDashMainGroup
        .attr('class', 'spoke-dash-main-group visible');

      spokeDashes
        .data(data)
        .transition()
        .duration(options.durations.spokeMorph)
        .style('stroke', windColor);

      return true;
    }

    console.error('Unknown weather condition `' + weatherCondition + '`.');
    return false;
  }

  function drawWeekLines() {
    weekLineArc = d3.svg.arc()
      .innerRadius(circleGroupRadius + options.weekLineOffset)
      .outerRadius(circleGroupRadius + options.weekLineOffset + options.weekLineWidth)
      .startAngle(function(d, i) {
        return (d[0]) / options.days * 2 * Math.PI;
      })
      .endAngle(function(d, i) {
        return ((d[1] - 1) / options.days + options.spokeWidth / (circleGroupRadius * 2 * Math.PI)) * 2 * Math.PI;
      });

    weekLines = circleGroup.selectAll('path.week-line')
      .data(weeksData);

    weekLinesEnter = weekLines.enter().append('path')
      .attr('d', weekLineArc)
      .style('fill', k.k5);
  }

  function drawMonthLines() {
    monthLineArc = d3.svg.arc()
      .innerRadius(circleGroupRadius + options.monthLineOffset)
      .outerRadius(circleGroupRadius + options.monthLineOffset + options.monthLineWidth)
      .startAngle(function(d, i) {
        return (d.from - 1) / options.days * 2 * Math.PI;
      })
      .endAngle(function(d, i) {
        return ((d.to - 1) / options.days + options.spokeWidth / (circleGroupRadius * 2 * Math.PI)) * 2 * Math.PI;
      });

    monthLines = circleGroup.selectAll('path.month-line')
      .data(monthsData);

    monthLinesEnter = monthLines.enter().append('path')
      .attr('d', monthLineArc)
      .style('fill', k.k5)
      .moveToBack();

    monthLeftWings = circleGroup.selectAll('line.month-left-wing')
      .data(monthsData);

    monthLeftWingsEnter = monthLeftWings.enter().append('line')
      .attr('class', 'month-left-wing')
      .attr('transform', function(d, i) {
        return 'rotate(' + (((d.from - 1) / options.days) * 360 - 90 + 180 / (circleGroupRadius * Math.PI)) + ')';
      })
      .attr('x1', circleGroupRadius + options.monthLineOffset)
      .attr('y1', 0)
      .attr('x2', circleGroupRadius + options.monthLineOffset + options.monthWingWidth)
      .attr('y2', 0)
      .style('stroke-width', options.monthLineWidth)
      .style('stroke', k.k5);

    monthRightWings = circleGroup.selectAll('line.month-right-wing')
      .data(monthsData);

    monthRightWingsEnter = monthRightWings.enter().append('line')
      .attr('class', 'month-right-wing')
      .attr('transform', function(d, i) {
        return 'rotate(' + (((d.to - 1) / options.days + options.monthLineWidth / 2 / (circleGroupRadius * 2 * Math.PI)) * 360 - 90 + 180 / (circleGroupRadius * Math.PI)) + ')';
      })
      .attr('x1', circleGroupRadius + options.monthLineOffset)
      .attr('y1', 0)
      .attr('x2', circleGroupRadius + options.monthLineOffset + options.monthWingWidth)
      .attr('y2', 0)
      .style('stroke-width', options.monthLineWidth)
      .style('stroke', k.k5);

    monthNameGroups = circleGroup.selectAll('text.month-name')
      .data(monthsData);

    monthNameGroupsEnter = monthNameGroups.enter().append('g')
      .attr('transform', function(d, i) {
        return 'rotate(' + ((i + 0.5) / 12 * 360 - 90) + ')';
      });

    monthNameGroupsEnter.append('text')
      .attr('class', 'month-name')
      .attr('transform', function(d, i) {
        var translateX, rotate;

        translateX = circleGroupRadius + options.monthNameOffset;

        rotate = i > 2 && i < 9 ? 270 : 90;

        return 'translate(' + translateX + ', 0) rotate(' + rotate + ')';
      })
      .text(function(d, i) {
        return utils.monthName(i);
      });
  }

  function prepareWeekSlice() {
    weekSliceArc = d3.svg.arc()
      .innerRadius(options.weekSliceInnerOffset)
      .outerRadius(circleGroupRadius + options.weekLineOffset + options.weekSliceOuterOffset);

    weekSlice = circleGroup.append('path')
      .attr('class', 'week-slice')
      .moveToBack();

    weekNumberLabelGroup = circleGroup.append('g');

    weekNumberLabelText = weekNumberLabelGroup.append('text')
      .attr('class', 'week-number-label');

    svg
      .on('mouseenter', showWeekSlice)
      .on('mouseleave', hideWeekSlice);

    d3.select(document)
      .on('mousemove', moveWeekSlice);
  }

  function showWeekSlice() {
    weekSlice.attr('class', 'week-slice visible');
    weekNumberLabelText.attr('class', 'week-number-label visible');

    calendarWeekChart.show();
    calendarControls.syncNumberContainer(false);
  }

  function hideWeekSlice() {
    weekSlice.attr('class', 'week-slice');
    weekNumberLabelText.attr('class', 'week-number-label');

    calendarWeekChart.hide();

    if (sync.getKey()) {
      calendarControls.syncNumberContainer(true);
    }
  }

  function moveWeekSlice() {
    var coords, rad;

    coords = d3.mouse(circleGroup.node());

    rad = Math.atan2(coords[0], -coords[1]);

    drawWeekSlice(rad);

    window.clearTimeout(weekSliceTimeout);
  }

  function drawWeekSlice(rad) {
    var day, weekData, rotationStartAngle, rotationEndAngle, textLabelRotation;

    day = mapRadiansToDay(rad);
    weekData = dayToWeekData(day);

    if (weekData !== null) {
      rotationStartAngle = (weekData[0]) / options.days * 2 * Math.PI;
      rotationEndAngle = ((weekData[1] - 1) / options.days + options.spokeWidth / (circleGroupRadius * 2 * Math.PI)) * 2 * Math.PI;

      weekSliceArc
        .startAngle(function() {
          return rotationStartAngle;
        })
        .endAngle(function() {
          return rotationEndAngle;
        });

      weekSlice
        .attr('d', weekSliceArc);

      textLabelRotation = (rotationStartAngle + rotationEndAngle) / 2 / (2 * Math.PI) * 360 - 90;

      weekNumberLabelGroup
        .attr('transform', 'rotate(' + textLabelRotation + ')');

      weekNumberLabelText
        .text('week ' + weekData[2])
        .attr('transform', function() {
          var translateX, rotate;

          translateX =
            circleGroupRadius +
            options.weekLineOffset +
            options.weekSliceOuterOffset +
            options.weekSliceTextOffset;

          rotate = textLabelRotation > 0 && textLabelRotation < 180 ? 270 : 90;

          return 'translate(' + translateX + ', 0) rotate(' + rotate + ')';
        });

      calendarWeekChart.update(weekData);
    }
  }

  function adjustContainerHeight() {
    // Chrome bug when going fullscreen
    v.container.style.height = window.innerHeight + 'px';
  }

  module.init = function() {
    svg = d3.select('#calendar');

    mainGroup = svg.append('g')
      .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

    circleGroup = mainGroup.append('g');

    // resize chart accordingly

    resizeChart();
    window.addEventListener('resize', resizeChart, false);
    window.addEventListener('orientationchange', resizeChart, false);

    findMinMaxTempAllLocations();
    findMaxPrecipitationAllLocations();
    findMinMaxWindSpeedAllLocations();

    // draw week lines

    drawWeekLines();

    // draw month lines

    drawMonthLines();

    // prepare week slice; draw it when hovering over the chart
    // draw week number label

    prepareWeekSlice();

    // everything's ready by now

    module.ready = true;

    // events

    adjustContainerHeight();
    window.addEventListener('resize', adjustContainerHeight, false);
    window.addEventListener('orientationchange', adjustContainerHeight, false);
  };

  module.update = function() {
    var status;

    status = calendarControls.getStatus();

    data = datasetsHelper.data[status.location + 'Weather' + status.year].map(function(d, i) {
      d.cloud_cover = +d.cloud_cover;
      d.precip_mm = +d.precip_mm;
      d.wind_speed = +d.wind_speed;

      return d;
    });

    setWarmthDomain();
    setPrecipitationDomain();
    setWindSpeedDomain();

    drawSpokes();

    spokeDashesDataChanged = true;

    updateSpokesAndDashes(status.weatherCondition);

    legends.show(status.weatherCondition);

    utils.setWeatherConditionLabel(status.weatherCondition);
  };

  module.drawWeekSlice = drawWeekSlice;

  module.ready = false;

  module.showWeekSlice = showWeekSlice;

  module.hideWeekSlice = hideWeekSlice;

  return module;
}();
