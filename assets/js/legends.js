var legends = function() {
  var module = {};

  var width = 200;
  var height = 200;
  var margins = {
    top: 10,
    right: 10,
    bottom: 25,
    left: 40
  };

  var options = {

  };

  var availWidth = width - margins.left - margins.right;
  var availHeight = height - margins.top - margins.bottom;

  var svg, mainGroup;

  module.init = function() {
    svg = d3.select('#legends')
      .attr('width', width)
      .attr('height', height);

    mainGroup = svg.append('g')
      .attr('class', 'main-group')
      .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');


  };

  module.show = function() {
    mainGroup.attr('class', 'main-group visible');
  };

  module.hide = function() {
    mainGroup.attr('class', 'main-group');
  };

  return module;
}();
