// Store name and speed for each transport option
const transports = {
  walking: {
    name: "Walking",
    speed: 3.1,
  },
  "evolve-bamboo": {
    name: "Evolve Bamboo GTR 2-in-1",
    speed: 24,
  },
  "onewheel-gt": {
    name: "Onewheel GT",
    speed: 20,
  },
  "razor-e-prime": {
    name: "Razor E Prime III",
    speed: 18,
  },
  "mototec-skateboard": {
    name: "MotoTec Electric Skateboard",
    speed: 22,
  },
  "segway-ninebot": {
    name: "Segway Ninebot S2",
    speed: 11,
  },
  "unagi-model-one": {
    name: "Unagi Model One E500",
    speed: 19,
  },
  "inmotion-v8s": {
    name: "Inmotion V8S (electric unicycle)",
    speed: 22,
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

// Function runs when user submits form
tripForm.addEventListener("submit", function (event) {
  // Keep browser on page instead of refreshing it
  event.preventDefault();

  // Read distance and selected transport from form
  const distance = distanceInput.valueAsNumber;
  const selectedKey = transportInput.value;

  // Handle calculation for all transport types separately
  if (selectedKey === "all") {
    // Remove results from previous calculation
    result.replaceChildren();

    // Add heading to result box
    const heading = document.createElement("h2");
    heading.textContent = `Travel Times for ${distance} Miles`;
    result.appendChild(heading);

    // Calculate and show time for each transport
    for (const transport of Object.values(transports)) {
      const travelTime = (distance / transport.speed) * 60;
      const roundedTime = Math.round(travelTime * 10) / 10;
      const transportResult = document.createElement("p");

      transportResult.textContent = `${transport.name}: ${roundedTime} minutes`;
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
  result.textContent = `${distance} miles on ${selectedTransport.name} takes ${roundedTime} minutes.`;
  result.hidden = false;
});
