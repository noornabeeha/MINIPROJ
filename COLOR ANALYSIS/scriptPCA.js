document.addEventListener("DOMContentLoaded", function() {
    const img = document.querySelector(".preview");
    const fileInput = document.querySelector("#image-select");
    const colorButton = document.querySelector(".open-picker");
    const result = document.querySelector(".res");

    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            img.src = e.target.result;
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    });

    colorButton.addEventListener("click", function() {
        const colorPicker = new EyeDropper();

        colorPicker.open().then(result => {
            result.innerHTML = `Picked color: ${result.sRGBHex}`;
            img.style.borderColor = result.sRGBHex;
        }).catch(error => {
            console.log("Error picking color: ", error);
        });
    });
});
