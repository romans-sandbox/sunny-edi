var legends = function() {
  var module = {};

  var width = 400;
  var height = 35;
  var margins = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  var options = {
    sunnySquareSize: 20,
    sunnyInnerSpace: 5,
    rainySquareWidth: 10,
    rainySquareHeight: 5,
    rainyItemsHeight: 30,
    rainyInnerSpace: 5,
    windySquareSize: 20,
    windyInnerSpace: 5,
    itemsInnerSpace: 20
  };

  var availWidth = width - margins.left - margins.right;
  var availHeight = height - margins.top - margins.bottom;

  var svg, mainGroup;
  var sunnyGroup, accumulatedSunnyGroupWidth;
  var rainyGroup, accumulatedRainyGroupWidth;
  var windyGroup, accumulatedWindyGroupWidth;

  function drawSunnyItems() {
    sunnyGroup = mainGroup.append('g')
      .attr('class', 'sunny');

    accumulatedSunnyGroupWidth = 0;

    drawSingleSunnyItem(k.theta, 'Hot Sunny Day');
    drawSingleSunnyItem(k.delta, 'Cold Sunny Day');
    drawSingleSunnyItem(k.gamma, 'Cloudy Day');
  }

  function drawSingleSunnyItem(squareColor, labelText) {
    var square, text, textBox;

    square = sunnyGroup.append('rect')
      .attr('x', accumulatedSunnyGroupWidth)
      .attr('y', 0)
      .attr('width', options.sunnySquareSize)
      .attr('height', options.sunnySquareSize)
      .style('fill', squareColor);

    text = sunnyGroup.append('text')
      .attr('x', accumulatedSunnyGroupWidth + options.sunnySquareSize + options.sunnyInnerSpace)
      .attr('y', 0)
      .attr('dy', '1.1em')
      .style('font-size', '0.8em')
      .text(labelText);

    textBox = text.node().getBBox();

    accumulatedSunnyGroupWidth +=
      options.sunnySquareSize +
      options.sunnyInnerSpace +
      textBox.width +
      options.itemsInnerSpace;
  }

  function drawRainyItems() {
    rainyGroup = mainGroup.append('g')
      .attr('class', 'rainy');

    accumulatedRainyGroupWidth = 0;

    drawSingleRainyItem(5, 'Heavy Rain');
    drawSingleRainyItem(2, 'Light Rain');
    drawSingleRainyItem(0.3, 'No Rain');
  }

  function drawSingleRainyItem(squareSize, labelText) {
    var square, text, textBox;

    square = rainyGroup.append('rect')
      .attr('x', accumulatedRainyGroupWidth)
      .attr('y', options.rainyItemsHeight - options.rainySquareHeight * squareSize)
      .attr('width', options.rainySquareWidth)
      .attr('height', options.rainySquareHeight * squareSize)
      .style('fill', k.eta);

    text = rainyGroup.append('text')
      .attr('x', accumulatedRainyGroupWidth + options.rainySquareWidth + options.rainyInnerSpace)
      .attr('y', options.rainyItemsHeight)
      .style('font-size', '0.8em')
      .text(labelText);

    textBox = text.node().getBBox();

    accumulatedRainyGroupWidth +=
      options.rainySquareWidth +
      options.rainyInnerSpace +
      textBox.width +
      options.itemsInnerSpace;
  }

  function drawWindyItems() {
    windyGroup = mainGroup.append('g')
      .attr('class', 'windy');

    accumulatedWindyGroupWidth = 0;

    drawSingleWindyItem(k.eta, 'Light Wind');
    drawSingleWindyItem(k.kappa, 'Gentle Wind');
    drawSingleWindyItem(k.theta, 'Strong Wind');
  }

  function drawSingleWindyItem(squareColor, labelText) {
    var square, text, textBox;

    square = windyGroup.append('rect')
      .attr('x', accumulatedWindyGroupWidth)
      .attr('y', 0)
      .attr('width', options.windySquareSize)
      .attr('height', options.windySquareSize)
      .style('fill', squareColor);

    text = windyGroup.append('text')
      .attr('x', accumulatedWindyGroupWidth + options.windySquareSize + options.windyInnerSpace)
      .attr('y', 0)
      .attr('dy', '1.1em')
      .style('font-size', '0.8em')
      .text(labelText);

    textBox = text.node().getBBox();

    accumulatedWindyGroupWidth +=
      options.windySquareSize +
      options.windyInnerSpace +
      textBox.width +
      options.itemsInnerSpace;
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
