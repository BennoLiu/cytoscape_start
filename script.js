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
      selector: '.red',
      style: {
        'background-color': 'red',
      },
    },
    {
      selector: 'edge',
      style: {
        // label: 'data(id)',
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

const btn = document.querySelector('#btn');
btn.addEventListener('click', () => {
  btnClicked();
});

function btnClicked() {
  const c = cy.$('#c');
  c.addClass('red');
}
