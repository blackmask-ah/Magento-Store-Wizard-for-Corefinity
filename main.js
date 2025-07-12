function showLogout() {
  steps.forEach(id => document.getElementById(id)?.classList.add("hidden"));
  nav.forEach(n => n?.classList.remove("active"));

  document.getElementById("step-logout")?.classList.remove("hidden");
  document.getElementById("nav-logout")?.classList.add("active");

  document.querySelector(".progress-bar")?.classList.add("hidden");
}

function confirmLogout() {
  alert("You have been logged out!");
  location.reload(); // You can redirect to a login or welcome page instead
}

function cancelLogout() {
  document.getElementById("step-logout")?.classList.add("hidden");
  document.getElementById("nav-logout")?.classList.remove("active");

  document.getElementById(steps[currentStep])?.classList.remove("hidden");
  nav[currentStep]?.classList.add("active");

  document.querySelector(".progress-bar")?.classList.remove("hidden");
}

// === Show Profile ===
function showProfile() {
  // Hide all steps
  steps.forEach(id => document.getElementById(id)?.classList.add("hidden"));

  // Remove all active states
  nav.forEach(n => n?.classList.remove("active"));

  // Show Profile section
  document.getElementById("step-profile")?.classList.remove("hidden");
  document.getElementById("nav-profile")?.classList.add("active");

  // Hide progress bar
  document.querySelector(".progress-bar")?.classList.add("hidden");

  // Load from localStorage if exists
  document.getElementById("profileInputName").value = localStorage.getItem("profileName") || "";
  document.getElementById("profileInputEmail").value = localStorage.getItem("profileEmail") || "";
}

// === Hide Profile ===
function hideProfile() {
  document.getElementById("step-profile")?.classList.add("hidden");
  document.getElementById("nav-profile")?.classList.remove("active");

  // Go back to first wizard step
  currentStep = 0;
  document.getElementById(steps[currentStep])?.classList.remove("hidden");
  nav[currentStep]?.classList.add("active");

  // Show progress bar
  document.querySelector(".progress-bar")?.classList.remove("hidden");
}


// === Save Profile Info ===
function saveProfile() {
  const name = document.getElementById("profileInputName").value.trim();
  const email = document.getElementById("profileInputEmail").value.trim();

  if (!name || !email) {
    alert("Please fill out all fields.");
    return;
  }

  // Save to localStorage
  localStorage.setItem("profileName", name);
  localStorage.setItem("profileEmail", email);

  alert("Profile updated successfully!");
}


// === Hide Profile and go back to Wizard ===
function hideProfile() {
  document.getElementById("step-profile")?.classList.add("hidden");
  document.getElementById("nav-profile")?.classList.remove("active");

  // Show the current step in wizard
 currentStep = 0;
document.getElementById(steps[currentStep])?.classList.remove("hidden");
nav[currentStep]?.classList.add("active");


  // Show progress bar
  document.querySelector(".progress-bar")?.classList.remove("hidden");
}

// === Show My Sites ===
function showMySites() {
  // Hide all steps
  steps.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  // Remove all active classes
  nav.forEach(n => n?.classList.remove("active"));

  // Show My Sites section
  document.getElementById("step-mysites")?.classList.remove("hidden");
  document.getElementById("nav-mysites")?.classList.add("active");

  // Hide progress bar
  document.querySelector(".progress-bar")?.classList.add("hidden");
}

// === Hide My Sites and go back to Wizard ===
function hideMySites() {
  document.getElementById("step-mysites")?.classList.add("hidden");
  document.getElementById("nav-mysites")?.classList.remove("active");

  // Show the current step in wizard
  currentStep = 0;
document.getElementById(steps[currentStep])?.classList.remove("hidden");
nav[currentStep]?.classList.add("active");

  // Show progress bar
  document.querySelector(".progress-bar")?.classList.remove("hidden");
}


// === Platform Versions Data ===
const platformData = {
  magento: {
    versions: {
      '2.4.7': { php: '8.3', mariadb: '10.6', redis: '7.2', opensearch: '2.11' },
      '2.4.6': { php: '8.2', mariadb: '10.5', redis: '7.0', opensearch: '2.9' },
      '2.4.5': { php: '8.1', mariadb: '10.4', redis: '6.2', opensearch: '2.6' },
      '2.4.4': { php: '8.0', mariadb: '10.4', redis: '6.0', opensearch: '2.4' },
      '2.3.7': { php: '7.4', mariadb: '10.3', redis: '5.0', opensearch: 'N/A' }
    }
  },
  laravel: {
    versions: {
      '11': { php: '8.2', mariadb: '10.6', redis: '7.2', opensearch: 'N/A' },
      '10': { php: '8.1', mariadb: '10.4', redis: '6.2', opensearch: 'N/A' },
      '9': { php: '8.0', mariadb: '10.3', redis: '6.0', opensearch: 'N/A' },
      '8': { php: '7.4', mariadb: '10.3', redis: '5.0', opensearch: 'N/A' },
      '7': { php: '7.3', mariadb: '10.2', redis: '5.0', opensearch: 'N/A' }
    }
  },
  wordpress: {
    versions: {
      '6.5': { php: '8.1', mariadb: '10.4', redis: '7.0', opensearch: 'N/A' },
      '6.4': { php: '8.0', mariadb: '10.3', redis: '6.0', opensearch: 'N/A' },
      '6.3': { php: '7.4', mariadb: '10.2', redis: '5.0', opensearch: 'N/A' },
      '6.2': { php: '7.3', mariadb: '10.1', redis: '5.0', opensearch: 'N/A' },
      '5.9': { php: '7.2', mariadb: '10.0', redis: '4.0', opensearch: 'N/A' }
    }
  }
};

let currentStep = 0;
const steps = [
  "step-intro",
  "step-platform",
  "step-style",
  "step-modules",
  "step-summary",
  "step-finish",
  "step-mysites",
  "step-profile",
  "step-logout"  
];

const nav = steps.map(s => document.getElementById("nav-" + s.split("step-")[1]));

let selectedPlatform = "";
let selectedPlugins = [];

// === Wizard Navigation ===
function startWizard() {
  const name = document.getElementById("companyName").value.trim();
  if (!name) return alert("Enter company name");

  document.getElementById("welcome-box").classList.add("hidden");
  document.getElementById("wizardContainer").classList.remove("hidden");
  document.getElementById("infoCompanyName").textContent = name;
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  changeStep(currentStep + 1);
  if (currentStep === 4) buildSummary();
}

function prevStep() {
  changeStep(currentStep - 1);
}

function changeStep(i) {
  if (i < 0 || i >= steps.length) return;

  // Hide current step
  document.getElementById(steps[currentStep]).classList.add("hidden");
  nav[currentStep]?.classList.remove("active");

  // Set new step
  currentStep = i;
  document.getElementById(steps[currentStep]).classList.remove("hidden");
  nav[currentStep]?.classList.add("active");

  // Progress Bar Handling
  const progressBar = document.querySelector(".progress-bar");
  if (steps[currentStep] === "step-mysites") {
    progressBar.classList.add("hidden");
  } else {
    progressBar.classList.remove("hidden");
    document.getElementById("progress").textContent = `Step ${currentStep + 1} of 6`;
    document.getElementById("progress-fill").style.width = `${((currentStep + 1) / 6) * 100}%`;
  }
}

function validateStep(s) {
  if (s === 0 && !document.getElementById("storeName").value.trim()) {
    alert("Enter store name");
    return false;
  }
  return true;
}

// === Platform Selection ===
function selectPlatform(p) {
  selectedPlatform = p;
  document.getElementById("infoPlatformName").textContent = p;

  document.querySelectorAll(".platform-logos img").forEach(img => {
    img.classList.remove("selected");
    if (img.alt.toLowerCase() === p.toLowerCase()) img.classList.add("selected");
  });

  const versionSelect = document.getElementById("platformVersion");
  versionSelect.innerHTML = `<option value="" disabled selected>Select version</option>`;
  Object.keys(platformData[p].versions).forEach(v => {
    versionSelect.add(new Option(v, v));
  });

  document.getElementById("version-select").classList.remove("hidden");
  document.getElementById("dependencies").innerHTML = "";
}

function loadDependencies() {
  const version = document.getElementById("platformVersion").value;
  if (!version) return;

  const deps = platformData[selectedPlatform].versions[version];
  document.getElementById("infoVersionNumber").textContent = version;

  const depHTML = Object.entries(deps)
    .map(([k, val]) => `<li><strong>${k.toUpperCase()}:</strong> ${val}</li>`)
    .join("");

  document.getElementById("dependencies").innerHTML = `<ul>${depHTML}</ul>`;
}

// === Theme Selection + Preview ===
function selectTheme(theme) {
  document.querySelectorAll(".theme-radio-img").forEach(img =>
    img.classList.remove("selected-theme")
  );

  const themePreview = document.getElementById("themeImage");

  if (theme === "Luma") {
    document.getElementById("luma-img").classList.add("selected-theme");
    themePreview.innerHTML = `<br><img src="luma_theme.jpg" alt="Luma Preview" class="theme-preview-img" />`;
  } else if (theme === "Hyvä") {
    document.getElementById("hyva-img").classList.add("selected-theme");
    themePreview.innerHTML = `<br><img src="hyva_theme.png" alt="Hyvä Preview" class="theme-preview-img" />`;
  }

  document.getElementById("infoThemeUsed").textContent = theme;
  updateThemeColors();
}

function updateThemeColors() {
  const primary = document.getElementById("primaryColor").value;
  const secondary = document.getElementById("secondaryColor").value;
  const tertiary = document.getElementById("tertiaryColor").value;
  const preview = document.getElementById("themeImage");

  preview.style.backgroundColor = tertiary;
  preview.style.border = `3px solid ${secondary}`;
  preview.style.color = primary;
}

// === Logo Upload ===
function previewLogo() {
  const file = document.getElementById("logoUpload").files[0];
  const preview = document.getElementById("logoPreview");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="Logo Preview" style="max-height: 100px; max-width: 200px; display:block; margin-top: 10px;" />`;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = "[Logo]";
  }
}

// === Plugin Selection ===
function handlePluginButtons() {
  document.querySelectorAll("#step-modules .plugin-row").forEach(row => {
    const img = row.querySelector("img");
    const pluginName = img.alt;
    const addBtn = row.querySelectorAll("button")[0];
    const cancelBtn = row.querySelectorAll("button")[1];

    addBtn.addEventListener("click", () => {
      if (!selectedPlugins.includes(pluginName)) {
        selectedPlugins.push(pluginName);
        addBtn.disabled = true;
        cancelBtn.disabled = false;
        row.classList.add("plugin-selected");
        updatePluginStatus();
      }
    });

    cancelBtn.addEventListener("click", () => {
      selectedPlugins = selectedPlugins.filter(p => p !== pluginName);
      addBtn.disabled = false;
      cancelBtn.disabled = true;
      row.classList.remove("plugin-selected");
      updatePluginStatus();
    });

    cancelBtn.disabled = true;
  });
}

function updatePluginStatus() {
  const statusSpan = document.getElementById("infoPluginsUsed");
  statusSpan.textContent = selectedPlugins.length ? selectedPlugins.join(", ") : "None";
}

// === Summary ===
function buildSummary() {
  const storeName = document.getElementById("storeName").value.trim();
  const version = document.getElementById("platformVersion").value;
  const font = document.getElementById("defaultFont").checked
    ? "Default"
    : document.getElementById("fontInput").value;

  document.getElementById("infoStoreName").textContent = storeName;
  document.getElementById("infoPlatformName").textContent = selectedPlatform;
  document.getElementById("infoVersionNumber").textContent = version;
  document.getElementById("infoFontUsed").textContent = font;
  document.getElementById("infoPluginsUsed").textContent = selectedPlugins.join(", ") || "None";

  document.getElementById("summaryContent").innerHTML = `
    <p><strong>Store Name:</strong> ${storeName}</p>
    <p><strong>Platform:</strong> ${selectedPlatform}</p>
    <p><strong>Version:</strong> ${version}</p>
    <p><strong>Font:</strong> ${font}</p>
    <p><strong>Plugins:</strong> ${selectedPlugins.join(", ") || "None"}</p>`;
}

// === Submit ===
function submitForm() {
  alert("Configuration submitted successfully!");
  changeStep(5); // Move to step-finish

  const storeName = document.getElementById("storeName").value.trim();
  const version = document.getElementById("platformVersion").value;
  const createdBy = document.getElementById("infoCompanyName").textContent;
  const createdDate = new Date().toISOString().split("T")[0];

  const profileName = localStorage.getItem("profileName") || "N/A";
  const profileEmail = localStorage.getItem("profileEmail") || "N/A";

  const mySitesTable = document.querySelector(".site-table");
  if (mySitesTable) {
    const row = document.createElement("div");
    row.className = "site-row";
    row.innerHTML = `
      <span><a href="#">${storeName}</a></span>
      <span>${version}</span>
      <span>${profileName}</span>
      <span>${profileEmail}</span>
      <span>${createdDate}</span>
    `;
    mySitesTable.appendChild(row);
  }
}


// === DOM Ready ===
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("defaultFont").addEventListener("change", () => {
    document.getElementById("fontInput").disabled = defaultFont.checked;
  });

  ["primaryColor", "secondaryColor", "tertiaryColor"].forEach(id => {
    document.getElementById(id).addEventListener("input", updateThemeColors);
  });

  document.querySelectorAll(".theme-radio-img").forEach(img => {
    img.style.cursor = "pointer";
  });

  handlePluginButtons();
});
