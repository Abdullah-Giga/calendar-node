// import { objArr, AllDay } from "./objArr.js";

let objArr = [];
let allDay = [];

try {
  const res = await fetch("http://localhost:5000/myEvents");
  const data = await res.json();
  data.forEach((element) => {
    if (element.allDay) {
      allDay.push(element);
    } else {
      objArr.push(element);
    }
  });
  console.log(objArr);
  console.log(allDay);
} catch (error) {
  console.log(error);
}

// Sorting array wrt the time sequence
objArr.sort(function (a, b) {
  return a.start - b.start;
});

// Function to hande 24 hour format
function time(start) {
  if (start > 12) {
    return start - 12;
  } else {
    return start;
  }
}

// All day task function
function render_allDay() {
  let j = document.getElementById("8");
  for (let i = 0; i < allDay.length; i++) {
    j.innerHTML += `
                    <div class = "item-all" id = "All-day-${i}">
                    <a href = "/events/edit/${allDay[i]._id}"> 
                    <span class="gray-text">All Day- </span><b>${allDay[i].name}</b> <span class="green-text"> ${allDay[i].location}</span>
                    </a></div>
                    `;
  }
}

// Makng a new div for every scheduled task
const getDiv = (h, count, id, start, name, location) => {
  let div = `
      <div class="r-item r-item-full" id = "event-${count}" style = "height : ${h};">
      <a href = "/events/edit/${id}">
      <span class="gray-text">${time(
        start
      )}:00 - </span><b>${name}</b> <span class="green-text"> ${location}</span>
      </a></div>`;
  return div;
};

// Making new dv to handle time starting with .5 or :30 minute format

const getDivHalf = (h, count, id, start, name, location) => {
  let div = `
      <div class="r-item r-item-half" id = "event-${count}" style = "height : ${h};">
      <a href = "/events/edit/${id}">
      <span class="gray-text">${Math.trunc(
        time(start)
      )}:30 - </span><b>${name}</b> <span class="green-text"> ${location}</span>
      </a></div>`;
  return div;
};

// Find if collision occurs between two divs
function collision_helper(a, b) {
  const rect1 = a.getBoundingClientRect();
  const rect2 = b.getBoundingClientRect();
  const isInHoriztonalBounds =
    rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
  const isInVerticalBounds =
    rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
  const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
  return isOverlapping;
}

// Checking the collision and making divs responsive
function collision() {
  for (let i = 0; i < objArr.length; i++) {
    let j = 0;
    while (j != i && j < objArr.length - 1) {
      if (
        collision_helper(
          document.getElementById(`event-${i}`),
          document.getElementById(`event-${j}`)
        )
      ) {
        let parent = document.getElementById(`event-${j}`).parentElement;
        let child = document.getElementById(`event-${i}`);

        parent.appendChild(child);
        console.log(parent, child);
        child.style.marginTop = `${
          (objArr[i].start - objArr[j].start) * 122
        }px`;
      }
      j++;
    }
  }
}

// Rendering all the new task divs

const render = () => {
  let count = -1;
  console.log((10.5 - 10) * 120);
  objArr.forEach((e) => {
    let j = document.getElementById(e.start);

    if (e.start == j.id && j.id.includes(".5")) {
      count++;
      let h = `${(e.end - e.start) * 122}px`;
      j.innerHTML += getDivHalf(h, count, e._id, e.start, e.name, e.location);
    } else if (e.start == j.id && !j.id.includes(".5")) {
      count++;
      let h = `${(e.end - e.start) * 122}px`;
      j.innerHTML += getDiv(h, count, e._id, e.start, e.name, e.location);
    }
  });
};

// Function calls
render_allDay();
render();
collision();
