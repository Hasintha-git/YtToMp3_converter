const URL = "https://ytmp3converter-e7e60e67d645.herokuapp.com/api/download";
const socket = io("https://ytmp3converter-e7e60e67d645.herokuapp.com");

// const URL = "http://localhost:3000/api/download";
// const socket = io("http://localhost:3000/");

document.getElementById('convertForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const urlInput = document.getElementById('urlInput');
    const urlText = urlInput.value.trim();
    const convertButton = document.getElementById('convertButton');
    const downloadStatus = document.getElementById('downloadStatus');
  
    if (!isValidYouTubeUrl(urlText)) {
      showError("Invalid YouTube URL. Please enter a valid YouTube video link.");
      return;
    }
  
    document.getElementById('errorContainer').classList.add('hidden');
    document.getElementById('videoDetailsContainer').classList.add('hidden');
    
    // Hide convertForm and show downloadInpForm
    document.getElementById('convertForm').classList.add('hidden');
    document.getElementById('downloadInpForm').classList.remove('hidden');
    downloadStatus.textContent = "Preparing Conversion...";
  
    axios.post(URL, { url: urlText }, {
      responseType: "arraybuffer", // Use responseType arraybuffer for binary data
      onDownloadProgress: (progressEvent) => {
        downloadStatus.textContent = "Downloading... ";
      },
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "audio.mp3");
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      // Hide downloadInpForm and show convertForm
      document.getElementById('downloadInpForm').classList.add('hidden');
      document.getElementById('convertForm').classList.remove('hidden');
      urlInput.value = '';    
      // Refresh the browser after successful download
      location.reload();
    })
    .catch((error) => {
      const errorMessage = error.response && error.response.data.error ? error.response.data.error : "Download failed";
      showError(errorMessage);
  
      // Hide downloadInpForm and show convertForm
      document.getElementById('downloadInpForm').classList.add('hidden');
      document.getElementById('convertForm').classList.remove('hidden');
    });
  });
  
  
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorContainer').classList.remove('hidden');
}

function isValidYouTubeUrl(url) {
  const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(\?.*)?$/;
  return youtubePattern.test(url);
}

document.addEventListener("DOMContentLoaded", function () {
  function showSection(sectionId) {
    document.getElementById('downloadInpForm').classList.add('hidden');
    const sections = document.querySelectorAll(".content-section");
    sections.forEach(section => {
      if (section.id === sectionId) {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    });
  }

  showSection("home");

  const navLinks = document.querySelectorAll(".section_url");
  navLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const sectionId = link.getAttribute("href").substring(1);
      showSection(sectionId);
    });
  });
});
function toggleDescription(descriptionId) {
    var description = document.getElementById(descriptionId);
  
    
    // Check if the display property is not explicitly set to "block"
    if (description.style.display !== "block") {
      description.style.display = "block"; // If not, set it to "block"
    } else {
      description.style.display = "none"; // Otherwise, toggle it to "none"
    }
  }
  
document.addEventListener("DOMContentLoaded", function () {
  var descriptions = document.querySelectorAll(".box-description");
  descriptions.forEach(function (description) {
    description.classList.add('hidden');
  });
});
