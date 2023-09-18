const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
const btn = document.getElementById("btn");
const color = document.querySelector(".color");
const imageUpload = document.getElementById("image-upload");
const eyedropperColor = document.querySelector(".eyedropper-color");

btn.addEventListener("click", function () {
  // Your existing code for generating random colors
  let hexColor = "#";
  for (let i = 0; i < 6; i++) {
    hexColor += hex[getRandomNumber()];
  }

  color.textContent = hexColor;
  document.body.style.backgroundColor = hexColor;
});

function getRandomNumber() {
  return Math.floor(Math.random() * hex.length);
}

// Event listener for the image upload
imageUpload.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const imageContainer = document.querySelector(".image-container");

        // Calculate the new width and height to fit the container while maintaining aspect ratio
        const maxWidth = imageContainer.clientWidth * 0.9; // You can adjust this value to control the maximum size
        const maxHeight = imageContainer.clientHeight * 0.9; // You can adjust this value to control the maximum size
        const aspectRatio = img.width / img.height;

        let newWidth = img.width;
        let newHeight = img.height;

        if (newWidth > maxWidth) {
          newWidth = maxWidth;
          newHeight = newWidth / aspectRatio;
        }

        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = newHeight * aspectRatio;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Get the color from the clicked position on the image
        canvas.addEventListener("click", function (e) {
          const x = e.offsetX;
          const y = e.offsetY;
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          const pickedColor = rgbToHex(pixel[0], pixel[1], pixel[2]);

          const eyedropperColor = document.querySelector(".eyedropper-color");
          // eyedropperColor.textContent = `Picked color: ${pickedColor}`;
          const colorElement = eyedropperColor.querySelector(".color");
          colorElement.textContent = pickedColor;

          eyedropperColor.style.display = "block"; // Show the "Picked color" element
          document.body.style.backgroundColor = pickedColor;
        });

        imageContainer.innerHTML = ''; // Clear any existing content
        imageContainer.appendChild(canvas); // Add the canvas to the container
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
});



function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}
