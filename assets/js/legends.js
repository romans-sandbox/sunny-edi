var legends = function() {
  var module = {};

  var width = 400;
  var height = 90;
  var margins = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  var options = {
    sunnyGradientHeight: 10,
    sunnyGradientMargin: 50,
    sunnyGradientTextMargin: 15,
    sunnyGradientTextHotOffset: 0,
    sunnyGradientTextColdOffset: 200,
    sunnyGradientTextCloudyOffset: 332,
    rainyBarCount: 10,
    rainyBarHeight: 60,
    rainyBarInnerSpace: 2,
    rainyTextMargin: 5,
    rainyTextHeavyOffset: 0,
    rainyTextLightOffset: 200,
    rainyTextNoOffset: 353,
    windyColorsHeight: 10,
    windyColorsMargin: 50,
    windyTextMargin: 55,
    windyTextStrongMargin: 33,
    windyTextGentleMargin: 163,
    windyTextLightMargin: 305,
  };

  var availWidth = width - margins.left - margins.right;
  var availHeight = height - margins.top - margins.bottom;

  var svg, mainGroup, defs;
  var sunnyGroup, sunnyGradientDef;
  var rainyGroup;
  var windyGroup, accumulatedWindyGroupWidth;

  function drawSunnyItems() {
    sunnyGroup = mainGroup.append('g')
      .attr('class', 'sunny');

    sunnyGradientDef = defs.append('linearGradient')
      .attr('id', 'sunny-gradient');

    sunnyGradientDef.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', k.k3);

    sunnyGradientDef.append('stop')
      .attr('offset', '65%')
      .attr('stop-color', k.k4);

    sunnyGradientDef.append('stop')
      .attr('offset', '80%')
      .attr('stop-color', k.k2);

    sunnyGroup.append('rect')
      .attr('x', 0)
      .attr('y', options.sunnyGradientMargin)
      .attr('width', availWidth)
      .attr('height', options.sunnyGradientHeight)
      .style('fill', 'url(#sunny-gradient)');

    sunnyGroup.append('text')
      .attr('x', options.sunnyGradientTextHotOffset)
      .attr('y', options.sunnyGradientMargin + options.sunnyGradientTextMargin)
      .attr('dy', '1.1em')
      .style('font-size', '0.8em')
      .text('Hot Sunny Day');

    sunnyGroup.append('text')
      .attr('x', options.sunnyGradientTextColdOffset)
      .attr('y', options.sunnyGradientMargin + options.sunnyGradientTextMargin)
      .attr('dy', '1.1em')
      .style('font-size', '0.8em')
      .text('Cold Sunny Day');

    sunnyGroup.append('text')
      .attr('x', options.sunnyGradientTextCloudyOffset)
      .attr('y', options.sunnyGradientMargin + options.sunnyGradientTextMargin)
      .attr('dy', '1.1em')
      .style('font-size', '0.8em')
      .text('Cloudy Day');
  }

  function drawRainyItems() {
    var i;

    rainyGroup = mainGroup.append('g')
      .attr('class', 'rainy');

    for (i = 0; i < options.rainyBarCount; i++) {
      drawSingleRainyItemColumn(
        i === options.rainyBarCount - 1 ? 0.05 : 1 - i / options.rainyBarCount,
        i
      );
    }

    rainyGroup.append('text')
      .attr('x', options.rainyTextHeavyOffset)
      .attr('y', options.rainyBarHeight + options.rainyTextMargin)
      .attr('dy', '1.1em')
      .style('font-size', '0.8em')
      .text('Heavy Rain');

    rainyGroup.append('text')
      .attr('x', options.rainyTextLightOffset)
      .attr('y', options.rainyBarHeight + options.rainyTextMargin)
      .attr('dy', '1.1em')
      .style('font-size', '0.8em')
      .text('Light Rain');

    rainyGroup.append('text')
      .attr('x', options.rainyTextNoOffset)
      .attr('y', options.rainyBarHeight + options.rainyTextMargin)
      .attr('dy', '1.1em')
      .style('font-size', '0.8em')
      .text('No Rain');
  }

  function drawSingleRainyItemColumn(sizeProportion, position) {
    rainyGroup.append('rect')
      .attr('x', position * ((availWidth + options.rainyBarInnerSpace) / options.rainyBarCount))
      .attr('y', ((1 - sizeProportion) * options.rainyBarHeight))
      .attr('width', availWidth / options.rainyBarCount - options.rainyBarInnerSpace)
      .attr('height', sizeProportion * options.rainyBarHeight)
      .style('fill', k.k7);
  }

  function drawWindyItems() {
    var i, colors;

    windyGroup = mainGroup.append('g')
      .attr('class', 'windy');

    colors = [k.k3, k.k8, k.k7];

    for (i = 0; i < 3; i++) {
      windyGroup.append('rect')
        .attr('x', availWidth / 3 * i)
        .attr('y', options.windyColorsMargin)
        .attr('width', availWidth / 2)
        .attr('height', options.windyColorsHeight)
        .style('fill', colors[i]);
    }

    windyGroup.append('text')
      .attr('x', options.windyTextStrongMargin)
      .attr('y', options.windyColorsHeight + options.windyTextMargin)
      .attr('dy', '1.1em')
      .style('font-size', '0.8em')
      .text('Strong Wind');

    windyGroup.append('text')
      .attr('x', options.windyTextGentleMargin)
      .attr('y', options.windyColorsHeight + options.windyTextMargin)
      .attr('dy', '1.1em')
      .style('font-size', '0.8em')
      .text('Gentle Wind');

    windyGroup.append('text')
      .attr('x', options.windyTextLightMargin)
      .attr('y', options.windyColorsHeight + options.windyTextMargin)
      .attr('dy', '1.1em')
      .style('font-size', '0.8em')
      .text('Light Wind');
  }

  function hideAll() {
    sunnyGroup.attr('class', 'sunny');
    rainyGroup.attr('class', 'rainy');
    windyGroup.attr('class', 'windy');
  }

  module.init = function() {
    svg = d3.select('#legends')
      .attr('width', width)
      .attr('height', height);

    mainGroup = svg.append('g')
      .attr('class', 'main-group')
      .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

    defs = svg.append('defs');

    drawSunnyItems();

    drawRainyItems();

    drawWindyItems();
  };

  module.show = function(group) {
    hideAll();

    if (group === 'sunny') {
      sunnyGroup.attr('class', 'sunny visible');
    }

    if (group === 'rainy') {
      rainyGroup.attr('class', 'rainy visible');
    }

    if (group === 'windy') {
      windyGroup.attr('class', 'windy visible');
    }
  };

  return module;
}();
