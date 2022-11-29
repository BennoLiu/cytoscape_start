import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';
import { mesh1, tier1 } from './data';

cytoscape.use(fcose);
cytoscape.use(dagre);

let cy;

initMesh();

const btnEdit = document.querySelector('#btnEdit');
const btnUndo = document.querySelector('#btnUndo');
const btnRedo = document.querySelector('#btnRedo');
const btnCancel = document.querySelector('#btnCancel');
document.querySelector('#initMesh').addEventListener('click', initMesh);
document.querySelector('#initTier').addEventListener('click', initTier);
btnEdit.addEventListener('click', startEdit);
btnCancel.addEventListener('click', endEdit);

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
    autoungrabify: true,
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

function startEdit() {
  cy.autoungrabify(false);
  updateButtons(true);
}

function endEdit() {
  cy.autoungrabify(true);
  updateButtons(false);
}

function updateButtons(editMode) {
  btnEdit.disabled = editMode;
  btnUndo.disabled = !editMode;
  btnRedo.disabled = !editMode;
  btnCancel.disabled = !editMode;
}
