function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const progressBar = document.getElementById("progressBar");
  const status = document.getElementById("status");

  if (!file) {
    alert("Please select a file!");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5000/upload");

  // Progress tracking
  xhr.upload.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      progressBar.style.width = percent + "%";
      status.innerText = `Uploading... ${percent}%`;
    }
  });

  // When upload completes
  xhr.onload = () => {
    if (xhr.status === 200) {
      const res = JSON.parse(xhr.responseText);
      status.innerText = `✅ Uploaded: ${res.filename} (${res.size})`;
      progressBar.style.width = "100%";
    } else {
      status.innerText = `❌ ${xhr.responseText}`;
    }
  };

  xhr.onerror = () => {
    status.innerText = "❌ Upload failed!";
  };

  xhr.send(formData);
}

// Show file name and size before upload
document.getElementById("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const fileInfo = document.getElementById("fileInfo");

  if (file) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    fileInfo.innerText = `Selected file: ${file.name} (${sizeMB} MB)`;
  } else {
    fileInfo.innerText = "";
  }
});
