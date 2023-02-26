
window.onload = function() {

  makeResizable();
}

function makeResizable()
{

const svg = document.getElementById('mysvg');
const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

svg.appendChild(group);
group.appendChild(rect);
group.setAttribute('class', 'resize-me');

rect.setAttribute('x', 100);
rect.setAttribute('y', 100);
rect.setAttribute('width', 100);
rect.setAttribute('height', 100);
rect.setAttribute('stroke-width', 2);
rect.setAttribute('stroke', 'white');
rect.setAttribute('fill', 'grey');

// Create the handles
const handles = [];
for (let i = 0; i < 8; i++) {
  const handle = document.createElementNS("http://www.w3.org/2000/svg", "rect");

  handle.setAttribute('width', 8);
  handle.setAttribute('height', 8);
  handle.setAttribute('stroke-width', 1);
  handle.setAttribute('stroke', 'white');
  handle.setAttribute('fill', 'black');

  handles.push(handle);
  group.appendChild(handle);
}

// Manually assign them their resize duties (R->L, T->B)
handles[0].classList.add('resize-top', 'resize-left');
handles[1].classList.add('resize-top');
handles[2].classList.add('resize-top', 'resize-right');
handles[3].classList.add('resize-left');
handles[4].classList.add('resize-right');
handles[5].classList.add('resize-bottom', 'resize-left');
handles[6].classList.add('resize-bottom');
handles[7].classList.add('resize-bottom', 'resize-right');

// This function takes the rect and the list of handles and positions
// the handles accordingly
const findLocations = (r, h) => {
  const x = Number(r.getAttribute('x'));
  const y = Number(r.getAttribute('y'));
  const width = Number(r.getAttribute('width'));
  const height = Number(r.getAttribute('height'));

  // Important these are in the same order as the classes above
  let locations = [
    [0, 0],
    [width / 2, 0],
    [width, 0],
    [0, height / 2],
    [width, height / 2],
    [0, height],
    [width / 2, height],
    [width, height]
  ];

  // Move each location such that it's relative to the (x,y) of the rect,
  // and also subtract half the width of the handles to make up for their
  // own size.
  locations = locations.map(subarr => [
    subarr[0] + x - 4,
    subarr[1] + y - 4
  ]);

  for (let i = 0; i < locations.length; i++) {
    h[i].setAttribute('x', locations[i][0]);
    h[i].setAttribute('y', locations[i][1]);
  }
}

interact('.resize-me')
  .resizable({
    edges: {
      left: '.resize-left',
      right: '.resize-right',
      bottom: '.resize-bottom',
      top: '.resize-top'
    }
  })
  .on('resizemove', function(event) {
    // Resize the rect, not the group, it will resize automatically
    const target = event.target.querySelector('rect');

    for (const attr of ['width', 'height']) {
      let v = Number(target.getAttribute(attr));
      v += event.deltaRect[attr];
      target.setAttribute(attr, v);
    }

    for (const attr of ['top', 'left']) {
      const a = attr == 'left' ? 'x' : 'y';
      let v = Number(target.getAttribute(a));
      v += event.deltaRect[attr];
      target.setAttribute(a, v);
    }

    findLocations(rect, handles);
  });

findLocations(rect, handles);

}
