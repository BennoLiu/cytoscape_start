import cytoscape from 'cytoscape';

const cy = cytoscape({
  container: document.querySelector('#cy'),
  elements: {
    nodes: [
      { data: { id: 'a', num: 1, bgc: 'blue' } },
      { data: { id: 'b', num: 2, bgc: 'green' } },
      { data: { id: 'c', num: 3 } },
      { data: { id: 'd', num: 4 } },
      { data: { id: 'e', num: 5 } },
      { data: { id: 'f', num: 6 } },
      { data: { id: 'g', num: 7 } },
      { data: { id: 'h', num: 8 } },
    ],
    edges: [
      { data: { id: 'a_b', source: 'a', target: 'b', num: 9 } },
      { data: { id: 'a_c', source: 'a', target: 'c', num: 10 } },
      { data: { id: 'a_d', source: 'a', target: 'd', num: 11 } },
      { data: { id: 'a_e', source: 'a', target: 'e', num: 12 } },
      { data: { id: 'a_f', source: 'a', target: 'f', num: 13 } },
      { data: { id: 'b_c', source: 'b', target: 'c', num: 14 } },
      { data: { id: 'b_d', source: 'b', target: 'd', num: 15 } },
    ],
  },
  style: [
    {
      selector: 'node',
      style: {
        label: 'data(id)',
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
        label: 'data(id)',
      },
    },
  ],
  layout: {
    name: 'grid',
    rows: 2,
  },
});

const btn = document.querySelector('#btn');
btn.addEventListener('click', () => {
  btnClicked();
});

function btnClicked() {
  const c = cy.$('#c');
  c.addClass('red');
}
