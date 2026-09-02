// Store name and speed and range for each transport option
const transports = {
  walking: {
    name: "Walking",
    speed: 3.1,
    range: 30,
  },
  "evolve-bamboo": {
    name: "Evolve Bamboo GTR 2-in-1",
    speed: 24,
    range: 31,
  },
  "onewheel-gt": {
    name: "Onewheel GT",
    speed: 20,
    range: 32,
  },
  "razor-e-prime": {
    name: "Razor E Prime III",
    speed: 18,
    range: 15,
  },
  "mototec-skateboard": {
    name: "MotoTec Electric Skateboard",
    speed: 22,
    range: 10,
  },
  "segway-ninebot": {
    name: "Segway Ninebot S2",
    speed: 11,
    range: 22,
  },
  "unagi-model-one": {
    name: "Unagi Model One E500",
    speed: 19,
    range: 15.5,
  },
  "inmotion-v8s": {
    name: "Inmotion V8S (electric unicycle)",
    speed: 22,
    range: 47,
  },
};

// Find form inputs in site
const distanceInput = document.querySelector("#distance");
const transportInput = document.querySelector("#transport");
const tripForm = document.querySelector("#trip-form");
const result = document.querySelector("#result");

// Add dropdown option for each transport
for (const [key, transport] of Object.entries(transports)) {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = transport.name;
  transportInput.appendChild(option);
}

// Add warning text when distance is beyond transport range
function addRangeWarning(resultLine, distance, transport) {
  if (distance > transport.range) {
    const warning = document.createElement("span");
    warning.className = "range-warning";
    warning.textContent = ` Exceeds the ${transport.range}-mile range.`;
    resultLine.appendChild(warning);
  }
}

// Function runs when user submits form
tripForm.addEventListener("submit", function (event) {
  // Keep browser on page instead of refreshing it
  event.preventDefault();

  // Read distance and selected transport from form
  const distance = distanceInput.valueAsNumber;
  const selectedKey = transportInput.value;

  // Replace previous results and add heading to result box
  result.replaceChildren();
  const heading = document.createElement("h2");
  heading.textContent = `Travel Time for ${distance} Miles`;
  result.appendChild(heading);

  // Handle calculation for all transport types separately
  if (selectedKey === "all") {
    // Calculate and show time for each transport
    for (const transport of Object.values(transports)) {
      const travelTime = (distance / transport.speed) * 60;
      const roundedTime = Math.round(travelTime * 10) / 10;
      const transportResult = document.createElement("p");

      transportResult.textContent = `${transport.name}: ${roundedTime} minutes`;
      addRangeWarning(transportResult, distance, transport);
      result.appendChild(transportResult);
    }

    result.hidden = false;
    return;
  }

  const selectedTransport = transports[selectedKey];

  // Calculate travel time in hours, then convert to minutes
  const travelTime = (distance / selectedTransport.speed) * 60;

  // Round result to one decimal place
  const roundedTime = Math.round(travelTime * 10) / 10;

  // Show calculated travel time below form
  const transportResult = document.createElement("p");
  transportResult.textContent = `${selectedTransport.name}: ${roundedTime} minutes`;
  addRangeWarning(transportResult, distance, selectedTransport);
  result.appendChild(transportResult);
  result.hidden = false;
});
