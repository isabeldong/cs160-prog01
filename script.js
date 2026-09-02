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
  const selectedTransport = transports[selectedKey];

  // Calculate travel time in hours, then convert to minutes
  const travelTime = (distance / selectedTransport.speed) * 60;

  // Round result to one decimal place
  const roundedTime = Math.round(travelTime * 10) / 10;

  // Show  calculated travel time below form
  result.textContent = `${distance} miles on ${selectedTransport.name} takes ${roundedTime} minutes.`;
  result.hidden = false;
});
