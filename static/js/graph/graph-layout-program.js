/**
 * [graphLayout description]
 * @param {object} options
 * @param {string} options.data
 * @param {string} options.target
 */
(function () {
  function Vector(x, y) {
    this.x = x;
    this.y = y;
  }

  extend(Vector, {
    add: function (a, b) {
      return new Vector(a.x + b.x, a.y + b.y);
    },
    sub: function (a, b) {
      return new Vector(a.x - b.x, a.y - b.y);
    },
    scale: function (a, n) {
      return new Vector(a.x * n, a.y * n);
    },
    midPoint: function (a, b) {
      return Vector.scale(Vector.add(a, b), 0.5);
    },
    len: function (a) {
      return Math.sqrt(a.x * a.x + a.y * a.y);
    },
    unit: function (a) {
      var length = Vector.len(a);
      return new Vector(a.x / length, a.y / length);
    },
    orthogonal: function (a) {
      return new Vector(-a.y, a.x);
    },
    angle: function (a) {
      return Math.atan2(a.y, a.x) * 180 / Math.PI;
    }
  });

  function assert(a) {
    if (!a) {
      throw Error('message');
    }
  }

  function digraphValueData(a, b) {
    var ab = Vector.sub(b, a);
    return extend(
      { angle: Vector.angle(ab) },
      Vector.midPoint(a, b)
    );
  }

  function transform(o) {
    var str = '';
    if ('translate' in o) {
      str += ' translate(' + o.translate.x + ', ' + o.translate.y + ')';
    }
    if ('rotate' in o) {
      str += ' rotate(' + o.rotate + ')';
    }
    return str;
  }

  function selfLoop(uIndex, meta, margin) {
    var nodes = meta.nodes;
    var adjacent = meta.adjacent[uIndex];
    var dir = new Vector(0, 0);
    var u = nodes[uIndex];
    for (var i = 0; i < adjacent.length; i += 1) {
      var vIndex = adjacent[i];
      var v = nodes[vIndex];
      dir = Vector.unit(Vector.add(
        dir,
        Vector.unit(Vector.sub(u, v))
      ));
    }
    var up = Vector.add(u, Vector.scale(dir, margin));
    var mid = Vector.midPoint(u, up);
    var ort = Vector.orthogonal(dir);

    var right = Vector.add(mid, Vector.scale(ort, margin / 2));
    var left = Vector.add(mid, Vector.scale(ort, -margin / 2));

    return {
      path: [left, up, right],
      dir: ort
    }
  }

  function createPath(d, meta, margin) {
    var u, v;
    var current;
    var mid;
    if (d.source.index < d.target.index) {
      u = d.source;
      v = d.target;
    } else {
      u = d.target;
      v = d.source;
    }
    meta[u.index] = meta[u.index] || {};

    current = (meta[u.index][v.index] = meta[u.index][v.index] || {
      count: 1,
      mid: Vector.midPoint(u, v),
      direction: -1
    });

    var innerJoints = [];

    if (u.index === v.index) {
      // apply the following for self-loop edges
      extend(current, {
        unit: Vector.unit(new Vector(1, 1))
      });
      var loop = selfLoop(u.index, meta, margin * (current.count + 1));
      innerJoints = loop.path;
      d.unit = loop.dir;
      // innerJoints.push(
      //   Vector.add(
      //     u,
      //     Vector.scale(
      //       current.unit,
      //       margin * current.count
      //     )
      //   ),
      //   Vector.add(
      //     u,
      //     Vector.scale(
      //       Vector.orthogonal(current.unit),
      //       margin * current.count
      //     )
      //   )
      // );
    } else {
      extend(current, {
        unit: Vector.unit(
          Vector.sub(v, u)
        ),
        unitInverse: Vector.orthogonal(
          Vector.unit(
            Vector.sub(v, u)
          )
        )
      });

      mid = Vector.add(
        current.mid,
        Vector.scale(
          current.unitInverse,
          Math.floor(current.count / 2) * margin * current.direction
        )
      );
      innerJoints.push(mid);
      d.unit = current.unit;
    }

    current.count += 1;
    current.direction *= -1;
    d.path = [d.source].concat(innerJoints).concat([d.target]);
  }

  function extend() {
    var first = arguments[0];
    for (var i = 1; i < arguments.length; i += 1) {
      for (var k in arguments[i]) {
        if (arguments[i].hasOwnProperty(k)) {
          first[k] = arguments[i][k];
        }
      }
    }
    return first;
  }

  var line = d3.svg.line()
    .x(function (d) { return d.x; })
    .y(function (d) { return d.y; })
    .tension(1.5)
    .interpolate('bundle');

  var createId = function () {
    var letter = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    return letter + Math.random().toString(16).substr(2);
  };

  /**
   * @param {Object} options
   *
   * options
   *   - target {string} selector to the element to hold the graph
   *   - data {Object}
   *     - groups {Array[Objects]}
   *     - nodes {Array[Objects]}
   *     - links {Array[Objects]}
   *       - class="" {string} additional class set to the edge
   *       - directed=false {boolean} true to give an orientation to this edge
   *       - value="" {string} Label of the edge (can be the weight)
   *     - width {number}
   *     - height {number}
   *     - linkDistance=90 {number} Forced min distance between vertices that
   *     have an edge
   *     - labels=true {boolean} False to hide the vertex labels
   *     - draggable=false {boolean} True to enable node drag
   *     - tree=false {boolean} True to layout the graph as a tree
   *     - directed=false {boolean} True to give an orientation to the edges
   *     - highlightIncomingEdges=false {boolean} true to highlight the incoming
   *     edges of a vertex on mouseover
   *     - highlightOutgoingEdges=false {boolean} true to highlight the outgoing
   *     edges of a vertex on mouseover
   *
   */
  var graphLayout = function (options) {
    assert(options.data);
    assert(options.target);

    // defaults on data
    var data = extend({
      width: 700,
      height: 300,
      linkDistance: 90,
      labels: true,
      treeLayout: false,
      directed: false,
      draggable: true,
      groups: [],
      constraints: []
    }, options.data);

    var id = createId();
    var color = d3.scale.category10();
    var markerId = id + '-arrow-marker';

    var svg = d3.select(options.target).selectAll('svg.graph')
      .data([options]);

    var svgEnter = svg.enter()
      .append('svg')
        .attr('class', 'graph')
        .attr('width', data.width)
        .attr('height', data.height)
      .append('svg:defs').append('svg:marker')
        .attr('id', markerId)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
      .append('svg:path')
        .attr('d', 'M0,-4L10,0L0,4L2,0')
        .attr('stroke-width', '0px')
        .attr('fill-opacity', .8)
        .attr('fill', 'black');

    if (svgEnter.size()) {
      svg.node().layout = window.cola.d3adaptor();

      svg.node().layout
        .linkDistance(function (d) {
          return d.linkDistance || data.linkDistance;
        })
        .avoidOverlaps(true)
        // .handleDisconnected(true)
        .size([data.width, data.height])
        // .convergenceThreshold(0.1)
        .nodes(data.nodes)
        .links(data.links)
        .constraints(data.constraints)
        .groups(data.groups);
      if (data.tree) {
        layout
          .flowLayout('y', 50)
          .symmetricDiffLinkLengths(20);
      }
    }
    var layout = svg.node().layout;

    var idToNode = {};
    // data preprocess
    data.nodes.forEach(function (v) {
      if (!v.hasOwnProperty('id')) {
        v.id = createId();
      }
      v.radius = v.radius || 10;
      v.width = v.width || 2 * v.radius;
      v.height = v.height || 2 * v.radius;
      idToNode[v.id] = v;
    });
    data.links.forEach(function (e) {
      if (!e.hasOwnProperty('id')) {
        e.id = createId();
      }
    });

    // need to obtain an initial layout for the node packing
    // to work with by specifying 30 iterations here
    layout
      .start(30, 30, 30);

    // additional properties of the graph
    // - adjacent vertices (as if it was undirected)
    var adjacent = {};
    data.links.forEach(function (e) {
      var u = e.source.index;
      var v = e.target.index;
      if (u !== v) {
        adjacent[u] = adjacent[u] || [];
        adjacent[v] = adjacent[v] || [];
        if (adjacent[u].indexOf(v) === -1) {
          adjacent[u].push(v);
        }
        if (adjacent[v].indexOf(u) === -1) {
          adjacent[v].push(u);
        }
      }
    });

    // groups (mostly done for k-partitions)
    var groups = svg.selectAll('.group')
      .data(data.groups);
    groups.enter().append('rect')
      .attr('rx', 8).attr('ry', 8)
      .attr('class', 'group')
      .attr('opacity', 0.05)
      .style('fill', function (d, i) { return color(i); });
    groups.exit()
      .remove();

    // edges
    var links = svg.selectAll('g.link')
      .data(data.links, function (d) { return d.id; });
    links.enter().append('g')
      .attr('class', 'link');
    links
      .each(function (d) {
        var self = d3.select(this);

        // additional classes
        var cls = [
          d.id,
          d['class'],
          (d.directed || data.directed) && 'directed',
          'source-' + d.source.id,
          'target-' + d.target.id
        ].filter(Boolean).join(' ');
        self.classed(cls, true);
      });
    links.exit()
      // .transition()
      // .style('stroke-width', 0)
      .remove();

    function highlightEdge(edge, highlight) {
      svg.selectAll('.link.' + edge.id)
        .selectAll('path')
        .each(function (d) {
          var parent = d3.select(this.parentNode);
          highlight = highlight || parent.classed('highlight');
          d3.select(this)
            .transition()
            .style('opacity', highlight ? 1 : 0.3)
            .style('stroke', highlight ? color.range()[3] : '#999');
        });
    }

    function incoming(d, over) {
      if (data.highlightIncomingEdges) {
        svg
          .selectAll('.link.target-' + d.id)
          .each(function (d) {
            highlightEdge(d, over);
          });
      }
    }

    function outgoing(d, over) {
      if (data.highlightOutgoingEdges) {
        svg
          .selectAll('.link.source-' + d.id)
          .each(function (d) {
            highlightEdge(d, over);
          });
      }
    }

    // vertices
    var nodes = svg.selectAll('g.node')
      .data(data.nodes, function (d) { return d.id; });
    var g = nodes.enter().append('g')
      .attr('class', function (d) {
        return 'node ' + (d['class'] || '');
      })
      .on('mouseover', function (d) {
        var el = d3.select(this);
        if (!el.over) {
          incoming(d, true);
          outgoing(d, true);
          el.style('cursor', 'pointer');
        }
        el.over = true;
      })
      .on('mouseout', function (d) {
        var el = d3.select(this);
        el.over = false;
        incoming(d, false);
        outgoing(d, false);
        el.style('cursor', null);
      })
      .call(layout.drag);

    var dragStart = layout.drag().on('dragstart.d3adaptor');
    var dragEnd  = layout.drag().on('dragend.d3adaptor');
    var dragging = false;
    layout.drag()
      .on('dragstart.d3adaptor', function (e) {
        dragging = true;
        if (data.draggable) {
          dragStart.apply(undefined, arguments);
        }
      })
      .on('dragend.d3adaptor', function (e) {
        dragging = false;
        if (data.draggable) {
          dragEnd.apply(undefined, arguments);
        }
      });

    g.append('circle')
      .attr('r', function (d) { return d.radius; })
      .style('fill', function (d) {
        // color based on the group
        if (d.parent) {
          return color(data.groups.indexOf(d.parent) + 1);
        }
        return color(0);
      })
      .each(function (d) {
        var parent = d3.select(this.parentNode);
        if (parent.classed('highlight')) {
          d3.select(this)
            .attr('stroke-width', 3)
            .attr('stroke', color.range()[1]);
        }
      });
    g.append('text')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('text-anchor', 'middle')
      .attr('y', 5)
      .attr('opacity', data.labels ? 1 : 0)
      .text(function (d) {
        if ('label' in d) {
          return d.label;
        }
        return d.id;
      });

    var nodeExit = nodes.exit();
    nodeExit
      .selectAll('circle')
      .transition()
      .attr('r', 0);
    nodeExit
      .transition()
      .remove();

    function update(transition) {
      // console.log('update, transition ', transition);
      var meta = {
        adjacent: adjacent,
        nodes: nodes.data()
      };
      links.each(function (d) {
        createPath(d, meta, 17);
      });

      (transition ? groups.transition() .ease('linear'): groups)
        .attr('x', function (d) { return d.bounds.x; })
        .attr('y', function (d) { return d.bounds.y; })
        .attr('width', function (d) { return d.bounds.width(); })
        .attr('height', function (d) { return d.bounds.height(); });

      var paths = links.selectAll('path')
        .data(function (d) { return [d.path]; });
      paths.enter()
        .append('path')
        .style('stroke', '#999')
        .style('fill', 'transparent')
        .style('opacity', .3)
        .style('stroke-width', 2);
      (transition ? paths.transition().ease('linear') : paths)
        .attr('d', line);
      links
        .each(function (d) {
          var g = d3.select(this);
          var path = g.select('path');

          if (g.classed('directed')) {
            path.attr('marker-end', 'url(#' + markerId + ')');
          }

          if (g.classed('highlight')) {
            highlightEdge(d, true);
          }
        });

      var weights = links.selectAll('text')
        .data(function (d) { return [d]; });
      weights.enter()
        .append('text')
        .style('font-size', '10px')
        .style('dominant-baseline', 'text-after-edge')
        .style('text-anchor', 'middle')
        .text(function (d) {
          return d.hasOwnProperty('value') ? d.value : '';
        });
      weights
        .attr('transform', function (d) {
          var angle = Vector.angle(d.unit);
          var v = d.path[Math.floor(d.path.length / 2)];
          return transform({
            translate: v,
            rotate: angle
          });
        });
      weights.exit()
        .remove();

      (transition ? nodes.transition().ease('linear') : nodes)
        .attr('transform', function (d) {
          return transform({
            translate: d
          });
        });
    }

    // update();
    // game loop
    var doTransition = true;
    layout.on('start', function () {
      doTransition = doTransition || !dragging;
    });
    layout.on('tick', function () {
      update(doTransition);
    });
    layout.on('end', function () {
      doTransition = false;
    });
  }

  window.graphLayout = graphLayout;
})();
