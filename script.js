import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';
import { mesh1, tier1 } from './data';

cytoscape.use(fcose);
cytoscape.use(dagre);

const cy = cytoscape({
  container: document.querySelector('#cy'),
  elements: tier1,
  // elements: mesh1,
  style: [
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
  ],
  layout: {
    name: 'dagre',
    // name: 'fcose',
    nodeDimensionsIncludeLabels: true,
  },
  wheelSensitivity: 0.1,
});

document.querySelector('#btnAddEvents').addEventListener('click', () => {
  addEvents();
});
document.querySelector('#btnRemoveEvents').addEventListener('click', () => {
  removeEvents();
});

function addEvents() {
  cy.edges().on('mousemove', edgeHovered).on('mouseout', edgeHoveredOut);
}
function removeEvents() {
  cy.edges().removeListener('mousemove', edgeHovered).removeListener('mouseout', edgeHoveredOut);
}

function edgeHovered(evt) {
  const edge = evt.target;
  edge.addClass('hovered');
}
function edgeHoveredOut(evt) {
  console.log('hovered out');
  const edge = evt.target;
  edge.removeClass('hovered');
}
