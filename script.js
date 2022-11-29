import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';
import { mesh1, tier1 } from './data';

cytoscape.use(fcose);
cytoscape.use(dagre);

let cy;

initMesh();

document.querySelector('#initMesh').addEventListener('click', initMesh);
document.querySelector('#initTier').addEventListener('click', initTier);

function initMesh() {
  const meshStyle = shareStyle();
  const meshLayout = {
    name: 'fcose',
    nodeDimensionsIncludeLabels: true,
  };
  init(mesh1, meshStyle, meshLayout);
}

function initTier() {
  const tierStyle = shareStyle();
  const tierLayout = {
    name: 'dagre',
    nodeDimensionsIncludeLabels: true,
  };
  init(tier1, tierStyle, tierLayout);
}

function shareStyle() {
  return [
    {
      selector: 'node',
      style: {
        label: 'data(itemName)',
      },
    },
    {
      selector: 'edge',
      style: {
        // label: 'data(id)',
      },
    },
    {
      selector: '.hovered',
      style: {
        width: 4,
      },
    },
  ];
}

function init(elements, style, layout) {
  cy = cytoscape({
    container: document.querySelector('#cy'),
    elements: elements,
    style: style,
    layout: layout,
    wheelSensitivity: 0.1,
  });
  addEvents();
}

function addEvents() {
  cy.edges().on('mousemove', edgeHovered).on('mouseout', edgeHoveredOut);
}
function edgeHovered(evt) {
  const edge = evt.target;
  edge.addClass('hovered');
}
function edgeHoveredOut(evt) {
  const edge = evt.target;
  edge.removeClass('hovered');
}
