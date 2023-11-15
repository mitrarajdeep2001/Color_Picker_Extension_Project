// CONSTANTS
const colorPickerBtn = document.querySelector("#color-picker");
const pickedColors = document.querySelector(".all-colors");
const clearAllBtn = document.querySelector(".clear-all");
const title = document.querySelector(".title");

//VARIABLES
let colors = JSON.parse(localStorage.getItem("colors")) || [];

//FUNCTION TO GENERATE HEX COLOR CODE
const activateColorPicker = async () => {
  try {
    if (!window.EyeDropper) {
      console.log("Your browser does not support the EyeDropper API");
      return;
    }
    const eyeDropper = new EyeDropper();
    const { sRGBHex } = await eyeDropper.open();
    navigator.clipboard.writeText(sRGBHex);
    colorPickerBtn.innerHTML = "PICKED";
    setTimeout(() => {
      colorPickerBtn.innerHTML = "Pick Color";
    }, 1000);
    savePickedColors(sRGBHex);
  } catch (error) {
    console.log(error);
  }
};
colorPickerBtn.addEventListener("click", activateColorPicker);

//FUNCTION TO SAVE COLORS TO LOCAL STORAGE AND THEN FETCH TO SHOW IN PICKED COLOR'S LIST
function savePickedColors(colorCode) {
  //ADD COLOR TO LIST IF IT DOESN'T ALREADY EXIST
  if (!colors.includes(colorCode)) {
    colors.push(colorCode);
    localStorage.setItem("colors", JSON.stringify(colors));
    pickedColors.innerHTML = colors
      .map(
        (c) =>
          `<li class="color" data-color=${c}>
        <div class="preview" data-color=${c} style="background-color: ${c}; border: 1px solid ${
            c === "#fff" ||
            c === "#ffff" ||
            c === "#ffffff" ||
            c === "#ffffffff"
              ? "#ccc"
              : c
          };"></div>
        <div class="value" data-color=${c}>${c}</div>
    </li>`
      )
      .join("");
    document.querySelector(".picked-color").style.display = "block";
  }
}

//FUNCTION TO COPY A COLOR FROM PICKED COLOR'S LIST TO CLIPBOARD
pickedColors.addEventListener("click", (event) => {
  const colorCode = event.target.getAttribute("data-color");
  navigator.clipboard.writeText(colorCode);
  event.target.parentNode.children[1].innerHTML = "COPIED";
  setTimeout(() => {
    event.target.parentNode.children[1].innerHTML = colorCode;
  }, 1000);
});

//FUNCTION TO CLEAR ALL COLORS FROM LOCAL STORAGE AND MAKE COLOR'S LIST EMPTY
const clearAllColors = () => {
  localStorage.setItem("colors", JSON.stringify([]));
  colors = [];
  pickedColors.innerHTML = colors
    .map(
      (c) =>
        `<li class="color" data-color=${c}>
      <div class="preview" data-color=${c} style="background-color: ${c}; border: 1px solid ${
          c === "#fff" || c === "#ffff" || c === "#ffffff" || c === "#ffffffff"
            ? "#ccc"
            : c
        };"></div>
      <div class="value" data-color=${c}>${c}</div>
  </li>`
    )
    .join("");
  document.querySelector(".picked-color").style.display = "none";
};
clearAllBtn.addEventListener("click", clearAllColors);

//FUNCTION TO FETCH THE COLORS FROM LOCAL STORAGE AND SHOW IN PICKED COLOR'S LIST WHEN DOM LOADED
window.addEventListener("DOMContentLoaded", () => {
  pickedColors.innerHTML = colors
    .map(
      (c) =>
        `<li class="color" data-color=${c}>
            <div class="preview" data-color=${c} style="background-color: ${c}; border: 1px solid ${
          c === "#fff" || c === "#ffff" || c === "#ffffff" || c === "#ffffffff"
            ? "#ccc"
            : c
        };"></div>
            <div class="value" data-color=${c}>${c}</div>
        </li>`
    )
    .join("");
  if (colors.length < 1) {
    document.querySelector(".picked-color").style.display = "none";
  }
});
