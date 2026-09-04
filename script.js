// Store name and speed and range for each transport option
const transports = {
  walking: {
    name: "Walking",
    speed: 3.1,
    range: 30,
    image: "assets/images/walking.png",
  },
  "evolve-bamboo": {
    name: "Evolve Bamboo GTR 2-in-1",
    speed: 24,
    range: 31,
    image: "assets/images/evolve-bamboo.webp",
  },
  "onewheel-gt": {
    name: "Onewheel GT",
    speed: 20,
    range: 32,
    image: "assets/images/onewheel-gt.jpg",
  },
  "razor-e-prime": {
    name: "Razor E Prime III",
    speed: 18,
    range: 15,
    image: "assets/images/razor-e-prime.jpg",
  },
  "mototec-skateboard": {
    name: "MotoTec Electric Skateboard",
    speed: 22,
    range: 10,
    image: "assets/images/mototec-skateboard.jpeg",
  },
  "segway-ninebot": {
    name: "Segway Ninebot S2",
    speed: 11,
    range: 22,
    image: "assets/images/segway-ninebot.avif",
  },
  "unagi-model-one": {
    name: "Unagi Model One E500",
    speed: 19,
    range: 15.5,
    image: "assets/images/unagi-model-one.png",
  },
  "inmotion-v8s": {
    name: "Inmotion V8S",
    speed: 22,
    range: 47,
    image: "assets/images/inmotion-v8s.png",
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

// Create one card for a transport result
function createTransportCard(transport, resultText, distance, isSelected) {
  const transportCard = document.createElement("article");
  transportCard.className = "transport-card";

  // Mark the card when the user selected this transport
  if (isSelected) {
    transportCard.classList.add("selected-transport");

    const selectedLabel = document.createElement("span");
    selectedLabel.className = "selected-label";
    selectedLabel.textContent = "Selected";
    transportCard.appendChild(selectedLabel);
  }

  const transportName = document.createElement("h3");
  transportName.textContent = transport.name;

  // Show the matching image without repeating the name for screen readers
  const transportImage = document.createElement("img");
  transportImage.className = "transport-image";
  transportImage.src = transport.image;
  transportImage.alt = "";

  const transportResult = document.createElement("p");
  transportResult.textContent = resultText;

  transportCard.appendChild(transportName);
  transportCard.appendChild(transportImage);
  transportCard.appendChild(transportResult);
  addRangeWarning(transportCard, distance, transport);

  return transportCard;
}

// Put the selected transport first, then add every other transport
function getOrderedTransports(selectedKey) {
  const orderedTransports = [];

  if (selectedKey !== "all") {
    orderedTransports.push(transports[selectedKey]);
  }

  for (const [key, transport] of Object.entries(transports)) {
    if (key !== selectedKey) {
      orderedTransports.push(transport);
    }
  }

  return orderedTransports;
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
  transportInput.value = "all";
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

  const resultGrid = document.createElement("div");
  resultGrid.className = "result-grid";
  resultSection.appendChild(resultGrid);

  // Calculate and show time for all transports in display order
  const orderedTransports = getOrderedTransports(selectedKey);
  for (const transport of orderedTransports) {
    const travelTime = (distance / transport.speed) * 60;
    const roundedTime = Math.round(travelTime * 10) / 10;
    const transportCard = createTransportCard(
      transport,
      `${roundedTime} minutes`,
      distance,
      transport === transports[selectedKey],
    );

    resultGrid.appendChild(transportCard);
  }

  resultSection.hidden = false;
}

// Calculate and show results for Time Mode
function showTravelDistance(time, selectedKey) {
  // Replace previous results and add heading to result box
  resultSection.replaceChildren();
  const heading = document.createElement("h2");
  heading.textContent = `Travel Distance for ${time} Minutes`;
  resultSection.appendChild(heading);

  const resultGrid = document.createElement("div");
  resultGrid.className = "result-grid";
  resultSection.appendChild(resultGrid);

  // Calculate and show distance for all transports in display order
  const orderedTransports = getOrderedTransports(selectedKey);
  for (const transport of orderedTransports) {
    const travelDistance = transport.speed * (time / 60);
    const roundedDistance = Math.round(travelDistance * 10) / 10;
    const transportCard = createTransportCard(
      transport,
      `${roundedDistance} miles`,
      travelDistance,
      transport === transports[selectedKey],
    );

    resultGrid.appendChild(transportCard);
  }

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
