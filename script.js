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

initTier();

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
        'curve-style': 'taxi',
        'taxi-direction': 'vertical',
        'taxi-turn': '50%',
      },
    },
    {
      selector: 'edge[distance]',
      style: {
        'taxi-turn': 'data(distance)',
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
  cy.edges().unpanify();
  addEvents();
  const options = {
    actions: {
      updateDistance: {
        _do: (args) => {
          args.edge.data('distance', `${args.endDistance}%`);
          return args;
        },
        _undo: (args) => {
          args.edge.data('distance', `${args.startDistance}%`);
          return args;
        },
      },
    },
  };
  const ur = cy.undoRedo(options);
}

function addEvents() {
  cy.edges().on('mouseover', edgeHovered).on('mouseout', edgeHoveredOut);
  cy.on('afterDo afterUndo afterRedo', afterEditAction);
}

function addEditModeEvents() {
  cy.on('mousedown', cyMousedown).on('mousemove', cyMousemove).on('mouseup', cyMouseup);
}

function removeEditModeEvents() {
  cy.removeListener('mousedown', cyMousedown).removeListener('mousemove', cyMousemove).removeListener('mouseup', cyMouseup);
}

function edgeHovered(evt) {
  const edge = evt.target;
  edge.addClass('hovered');
  if (!cy.data('duringMousedown')) {
    const startDistance = parseFloat(edge.data('distance')) || 50;
    const args = {
      edge: edge,
      edgeId: edge.id(),
      startDistance: startDistance,
    };
    cy.data('movingArgs', args);
  }
}

function edgeHoveredOut(evt) {
  const edge = evt.target;
  edge.removeClass('hovered');
  if (!cy.data('duringMousedown')) {
    cy.removeData('movingArgs');
  }
}

function afterEditAction(evt, actionName, args, res) {
  console.log(`${evt.type} ${actionName}`);
  updateButtons(true);
}

function cyMousedown(evt) {
  cy.data('duringMousedown', true);
}

function cyMousemove(evt) {
  if (cy.data('duringMousedown') && cy.data('movingArgs') !== undefined) {
    const edge = cy.data('movingArgs').edge;
    const srcY = edge.source().position().y;
    const tgtY = edge.target().position().y;
    const one = (tgtY - srcY) / 100;
    const srcH = edge.source().numericStyle('height');
    const minDistance = Math.abs((srcH * 0.5) / one);
    const mouseY = evt.position.y;
    let newDistance = (mouseY - srcY) / one;
    if (newDistance > 100 - minDistance) {
      newDistance = 100 - minDistance;
    }
    if (newDistance < minDistance) {
      newDistance = minDistance;
    }
    edge.data('distance', `${newDistance}%`);
  }
}

function cyMouseup(evt) {
  cy.removeData('duringMousedown');
  if (cy.data('movingArgs') !== undefined) {
    const args = cy.data('movingArgs');
    args.endDistance = parseFloat(args.edge.data('distance')) || 50;
    const ur = cy.scratch('_undoRedo').instance;
    ur.do('updateDistance', args);
    cy.removeData('movingArgs');
  }
}

function startEdit() {
  cy.autoungrabify(false);
  addEditModeEvents();
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
  removeEditModeEvents();
  updateButtons(false);
}

function updateButtons(editMode) {
  const ur = cy.scratch('_undoRedo').instance;
  btnEdit.disabled = editMode;
  btnUndo.disabled = !editMode || ur.isUndoStackEmpty();
  btnRedo.disabled = !editMode || ur.isRedoStackEmpty();
  btnCancel.disabled = !editMode;
}
