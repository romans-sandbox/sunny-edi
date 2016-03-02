var calendarChart = function() {
  var module = {};

  var width = 600;
  var height = 600;
  var margins = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };

  var options = {
    days: 365,
    firstDayOffset: 4,
    circleGroupMargin: 40,
    spokeWidth: 3,
    spokeSunnyLength: 20,
    spokeRainyMaxLength: 60,
    weekLineOffset: 5,
    weekLineWidth: 1,
    monthLineOffset: 8,
    monthLineWidth: 2,
    monthWingWidth: 10,
    monthNameOffset: 18,
    weekSliceInnerOffset: 150,
    weekSliceOuterOffset: 25,
    weekSliceTextOffset: 5,
    durations: {
      spokeMorph: 500
    }
  };

  var availWidth = width - margins.left - margins.right;
  var availHeight = height - margins.top - margins.bottom;

  var data, tempMaxMin = 0, tempMaxMax = Infinity, precipitationMax = 0;

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
  var weekSlice, weekSliceArc;
  var weekNumberLabelGroup, weekNumberLabelText;

  var warmth = d3.scale.linear()
    .range([k.delta, k.theta]);

  var precipitation = d3.scale.linear()
    .range([1, options.spokeRainyMaxLength]);

  function sunshine(d, i) {
    if (d.weather_desc === 'Sunny') {
      return warmth(d.max_temp);
    }

    return k.zeta;
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
      if (day >= weeksData[i][0] && day <= weeksData[i][1]) {
        return weeksData[i];
      }
    }

    return null;
  }

  function prepareWeatherData(location) {
    data = datasetsHelper.data[location + 'Weather'].map(function(d, i) {
      d.cloud_cover = +d.cloud_cover;
      d.precip_mm = +d.precip_mm;

      return d;
    });

    setWarmthDomain();
    setPrecipitationDomain();

    drawSpokes();
  }

  function findMinMaxTempAllLocations() {
    tempMaxMin = Math.min(
      d3.min(datasetsHelper.data.edinburghWeather, function(d, i) {
        return +d.max_temp;
      }),
      d3.min(datasetsHelper.data.madridWeather, function(d, i) {
        return +d.max_temp;
      })
    );

    tempMaxMax = Math.max(
      d3.max(datasetsHelper.data.edinburghWeather, function(d, i) {
        return +d.max_temp;
      }),
      d3.max(datasetsHelper.data.madridWeather, function(d, i) {
        return +d.max_temp;
      })
    );
  }

  function setWarmthDomain() {
    warmth
      .domain([tempMaxMin, tempMaxMax]);
  }

  function findMaxPrecipitationAllLocations() {
    precipitationMax = Math.max(
      d3.max(datasetsHelper.data.edinburghWeather, function(d, i) {
        return +d.precip_mm;
      }),
      d3.max(datasetsHelper.data.madridWeather, function(d, i) {
        return +d.precip_mm;
      })
    );
  }

  function setPrecipitationDomain() {
    precipitation
      .domain([0, precipitationMax]);
  }

  function prepareCircleGroup() {
    circleGroupRadius = Math.min(availWidth, availHeight) / 2 - options.circleGroupMargin;
    circleGroup = mainGroup.append('g')
      .attr(
        'transform',
        'translate(' +
        (availWidth / 2) +
        ', ' +
        (availHeight / 2) +
        ')'
      );
  }

  function drawSpokes() {
    if (spokesDrawn) {
      return false;
    }

    spokeGroups = circleGroup.selectAll('g.spoke-group').data(data);

    spokeGroupsEnter = spokeGroups.enter()
      .append('g')
      .attr('transform', function(d, i) {
        return 'rotate(' + (i / options.days * 360) + ')';
      });

    spokes = spokeGroupsEnter
      .append('line')
      .attr('class', 'spoke')
      .attr('x1', circleGroupRadius - options.spokeSunnyLength)
      .attr('y1', 0)
      .attr('x2', circleGroupRadius)
      .attr('y2', 0)
      .style('stroke-width', options.spokeWidth)
      .style('stroke', sunshine);

    spokesDrawn = true;

    return true;
  }

  function updateSpokes(weatherCondition) {
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
        .style('stroke', k.eta);

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
        return (d[0] + 1) / options.days * 2 * Math.PI;
      })
      .endAngle(function(d, i) {
        return ((d[1]) / options.days + 1 / (circleGroupRadius * Math.PI)) * 2 * Math.PI;
      });

    weekLines = circleGroup.selectAll('path.week-line')
      .data(weeksData);

    weekLinesEnter = weekLines.enter().append('path')
      .attr('d', weekLineArc)
      .style('fill', k.beta);
  }

  function drawMonthLines() {
    monthLineArc = d3.svg.arc()
      .innerRadius(circleGroupRadius + options.monthLineOffset)
      .outerRadius(circleGroupRadius + options.monthLineOffset + options.monthLineWidth)
      .startAngle(function(d, i) {
        return d.from / options.days * 2 * Math.PI;
      })
      .endAngle(function(d, i) {
        return ((d.to - 1) / options.days + options.spokeWidth / (circleGroupRadius * Math.PI)) * 2 * Math.PI;
      });

    monthLines = circleGroup.selectAll('path.month-line')
      .data(monthsData);

    monthLinesEnter = monthLines.enter().append('path')
      .attr('d', monthLineArc)
      .style('fill', k.gamma)
      .moveToBack();

    monthLeftWings = circleGroup.selectAll('line.month-left-wing')
      .data(monthsData);

    monthLeftWingsEnter = monthLeftWings.enter().append('line')
      .attr('class', 'month-left-wing')
      .attr('transform', function(d, i) {
        return 'rotate(' + (d.from / options.days * 360 - 90 + 180 / (circleGroupRadius * Math.PI)) + ')';
      })
      .attr('x1', circleGroupRadius + options.monthLineOffset)
      .attr('y1', 0)
      .attr('x2', circleGroupRadius + options.monthLineOffset + options.monthWingWidth)
      .attr('y2', 0)
      .style('stroke-width', options.monthLineWidth)
      .style('stroke', k.gamma);

    monthRightWings = circleGroup.selectAll('line.month-right-wing')
      .data(monthsData);

    monthRightWingsEnter = monthRightWings.enter().append('line')
      .attr('class', 'month-right-wing')
      .attr('transform', function(d, i) {
        return 'rotate(' + (d.to / options.days * 360 - 90 + 180 / (circleGroupRadius * Math.PI)) + ')';
      })
      .attr('x1', circleGroupRadius + options.monthLineOffset)
      .attr('y1', 0)
      .attr('x2', circleGroupRadius + options.monthLineOffset + options.monthWingWidth)
      .attr('y2', 0)
      .style('stroke-width', options.monthLineWidth)
      .style('stroke', k.gamma);

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
  }

  function hideWeekSlice() {
    weekSlice.attr('class', 'week-slice');
    weekNumberLabelText.attr('class', 'week-number-label');
  }

  function moveWeekSlice() {
    var coords, rad, weekData, rotationStartAngle, rotationEndAngle, textLabelRotation;

    coords = d3.mouse(circleGroup.node());

    rad = Math.atan2(coords[0], -coords[1]);

    weekData = dayToWeekData(mapRadiansToDay(rad));

    if (weekData !== null) {
      rotationStartAngle = (weekData[0] + 1) / options.days * 2 * Math.PI;
      rotationEndAngle = ((weekData[1]) / options.days + 1 / (circleGroupRadius * Math.PI)) * 2 * Math.PI;

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
    }
  }

  module.init = function() {
    svg = d3.select('#calendar')
      .attr('width', width)
      .attr('height', height);

    mainGroup = svg.append('g')
      .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

    findMinMaxTempAllLocations();
    findMaxPrecipitationAllLocations();

    // prepare circle group

    prepareCircleGroup();

    // draw week lines

    drawWeekLines();

    // draw month lines

    drawMonthLines();

    // prepare week slice; draw it when hovering over the chart
    // draw week number label

    prepareWeekSlice();

    // everything's ready by now

    module.ready = true;
  };

  module.update = function() {
    var status;

    status = calendarControls.getStatus();

    prepareWeatherData(status.location);

    updateSpokes(status.weatherCondition);
  };

  module.ready = false;

  return module;
}();
