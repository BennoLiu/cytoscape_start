import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';
import undoRedo from 'cytoscape-undo-redo';
import { mesh1, tier1 } from './data';

cytoscape.use(fcose);
cytoscape.use(dagre);
cytoscape.use(undoRedo);

let cy;
// let ur;

initMesh();

const btnEdit = document.querySelector('#btnEdit');
const btnUndo = document.querySelector('#btnUndo');
const btnRedo = document.querySelector('#btnRedo');
const btnCancel = document.querySelector('#btnCancel');
document.querySelector('#initMesh').addEventListener('click', initMesh);
document.querySelector('#initTier').addEventListener('click', initTier);
btnEdit.addEventListener('click', startEdit);
btnUndo.addEventListener('click', undo);
btnRedo.addEventListener('click', redo);
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
  cy.undoRedo();
  addEvents();
}

function addEvents() {
  cy.edges().on('mousemove', edgeHovered).on('mouseout', edgeHoveredOut);
  cy.on('afterDo afterUndo afterRedo', afterEditAction);
}
function edgeHovered(evt) {
  const edge = evt.target;
  edge.addClass('hovered');
}
function edgeHoveredOut(evt) {
  const edge = evt.target;
  edge.removeClass('hovered');
}

function afterEditAction(evt, actionName, args, res) {
  console.log(`${evt.type} ${actionName}`);
  updateButtons(true);
}

function startEdit() {
  cy.autoungrabify(false);
  updateButtons(true);
}

function undo() {
  const ur = cy.scratch('_undoRedo').instance;
  ur.undo();
}

function redo() {
  const ur = cy.scratch('_undoRedo').instance;
  ur.redo();
}

function endEdit() {
  cy.autoungrabify(true);
  updateButtons(false);
}

function updateButtons(editMode) {
  const ur = cy.scratch('_undoRedo').instance;
  btnEdit.disabled = editMode;
  btnUndo.disabled = !editMode || ur.isUndoStackEmpty();
  btnRedo.disabled = !editMode || ur.isRedoStackEmpty();
  btnCancel.disabled = !editMode;
}
