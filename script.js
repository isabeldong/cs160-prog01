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

// Store text that changes between calculation modes
const modes = {
  distance: {
    label: "Distance (Miles)",
    placeholder: "Ex: 8",
    button: "Calculate travel time",
  },
  time: {
    label: "Time (Minutes)",
    placeholder: "Ex: 30",
    button: "Calculate travel distance",
  },
};

// Find calculator elements in page
const tripValueInput = document.querySelector("#trip-value-input");
const transportInput = document.querySelector("#transport-input");
const tripForm = document.querySelector("#trip-form");
const resultSection = document.querySelector("#result-section");
const tripValueLabel = document.querySelector("#trip-value-label");
const calculateButton = document.querySelector("#calculate-button");
const modeInputs = document.querySelectorAll('input[name="mode"]');

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

// Update form text when user changes calculation mode
function updateMode() {
  const selectedMode = document.querySelector('input[name="mode"]:checked').value;
  const settings = modes[selectedMode];

  tripValueLabel.textContent = settings.label;
  tripValueInput.placeholder = settings.placeholder;
  calculateButton.textContent = settings.button;

  // Clear values and results from previous mode
  tripValueInput.value = "";
  resultSection.replaceChildren();
  resultSection.hidden = true;
}

// Listen for changes to either mode option
for (const modeInput of modeInputs) {
  modeInput.addEventListener("change", updateMode);
}

// Set form text for the mode selected when page loads
updateMode();

// Calculate and show results for Distance Mode
function showTravelTime(distance, selectedKey) {
  // Replace previous results and add heading to result box
  resultSection.replaceChildren();
  const heading = document.createElement("h2");
  heading.textContent = `Travel Time for ${distance} Miles`;
  resultSection.appendChild(heading);

  // Handle calculation for all transport types separately
  if (selectedKey === "all") {
    // Calculate and show time for each transport
    for (const transport of Object.values(transports)) {
      const travelTime = (distance / transport.speed) * 60;
      const roundedTime = Math.round(travelTime * 10) / 10;
      const transportResult = document.createElement("p");

      transportResult.textContent = `${transport.name}: ${roundedTime} minutes`;
      addRangeWarning(transportResult, distance, transport);
      resultSection.appendChild(transportResult);
    }

    resultSection.hidden = false;
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
  resultSection.appendChild(transportResult);
  resultSection.hidden = false;
}

// Calculate and show results for Time Mode
function showTravelDistance(time, selectedKey) {
  // Replace previous results and add heading to result box
  resultSection.replaceChildren();
  const heading = document.createElement("h2");
  heading.textContent = `Travel Distance for ${time} Minutes`;
  resultSection.appendChild(heading);

  // Handle calculation for all transport types separately
  if (selectedKey === "all") {
    // Calculate and show distance for each transport
    for (const transport of Object.values(transports)) {
      const travelDistance = transport.speed * (time / 60);
      const roundedDistance = Math.round(travelDistance * 10) / 10;
      const transportResult = document.createElement("p");

      transportResult.textContent = `${transport.name}: ${roundedDistance} miles`;
      addRangeWarning(transportResult, travelDistance, transport);
      resultSection.appendChild(transportResult);
    }

    resultSection.hidden = false;
    return;
  }

  const selectedTransport = transports[selectedKey];

  // Convert time to hours, then calculate travel distance
  const travelDistance = selectedTransport.speed * (time / 60);

  // Round result to one decimal place
  const roundedDistance = Math.round(travelDistance * 10) / 10;

  // Show calculated travel distance below form
  const transportResult = document.createElement("p");
  transportResult.textContent = `${selectedTransport.name}: ${roundedDistance} miles`;
  addRangeWarning(transportResult, travelDistance, selectedTransport);
  resultSection.appendChild(transportResult);
  resultSection.hidden = false;
}

// Function runs when user submits form
tripForm.addEventListener("submit", function (event) {
  // Keep browser on page instead of refreshing it
  event.preventDefault();

  // Read value, transport, and calculation mode from form
  const tripValue = tripValueInput.valueAsNumber;
  const selectedKey = transportInput.value;
  const selectedMode = document.querySelector('input[name="mode"]:checked').value;

  if (selectedMode === "distance") {
    showTravelTime(tripValue, selectedKey);
  } else {
    showTravelDistance(tripValue, selectedKey);
  }
});
