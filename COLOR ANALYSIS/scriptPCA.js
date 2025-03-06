const video = document.getElementById('video');
        const canvas = document.getElementById('imageCanvas');
        const ctx = canvas.getContext('2d');
        const startCamera = document.getElementById('startCamera');
        const snapPhoto = document.getElementById('snapPhoto');
        const uploadImage = document.getElementById('uploadImage');
        const colorPickerButton = document.getElementById('colorPickerButton');
        const colorHex = document.getElementById('colorHex');
        const seasonResult = document.getElementById('seasonResult');

        let stream = null;
        let imageLoaded = false;

        startCamera.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.style.display = 'block';
                canvas.style.display = 'none';
            } catch (error) {
                alert('Camera access denied or unavailable.');
                console.error('Error accessing webcam:', error);
            }
        });

        snapPhoto.addEventListener('click', () => {
            if (video.style.display === 'block') {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                video.style.display = 'none';
                canvas.style.display = 'block';
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                imageLoaded = true;
                colorPickerButton.style.display = 'inline-block';
            }
        });

        uploadImage.addEventListener('change', event => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        video.style.display = 'none';
                        canvas.style.display = 'block';
                        imageLoaded = true;
                        colorPickerButton.style.display = 'inline-block';
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        colorPickerButton.addEventListener('click', () => {
            if (!window.EyeDropper) {
                alert('Your browser does not support the EyeDropper API.');
                return;
            }
            const eyeDropper = new EyeDropper();
            eyeDropper.open()
                .then(result => {
                    colorHex.innerHTML = `<b>${result.sRGBHex}</b>`;
                    determineSeason(result.sRGBHex);
                })
                .catch(error => {
                    console.error('Error picking color:', error);
                });
        });

        function determineSeason(hex) {
            const r = parseInt(hex.substr(1, 2), 16);
            const g = parseInt(hex.substr(3, 2), 16);
            const b = parseInt(hex.substr(5, 2), 16);
            const brightness = (r + g + b) / 3;
            const warmCool = r - b;
            const contrast = Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
            
            let seasonType = "";
            if (warmCool > 20) {
                seasonType = brightness > 180 ? (contrast > 50 ? "Deep Spring" : "Soft Spring") : (contrast > 50 ? "Deep Autumn" : "Soft Autumn");
            } else {
                seasonType = brightness > 180 ? (contrast > 50 ? "Deep Summer" : "Soft Summer") : (contrast > 50 ? "Deep Winter" : "Soft Winter");
            }
            
            document.getElementById("seasonResult").innerHTML = `Your season is: <b>${seasonType}</b>`;
            displayPalette(seasonType);
        }

        function displayPalette(season) {
            const palettes = {
                "Deep Spring": ["#FF6F61", "#FFA07A", "#FFD700", "#008000", "#006400"],
                "Soft Spring": ["#F4A460", "#FFDAB9", "#E6E6FA", "#B0C4DE", "#98FB98"],
                "Deep Autumn": ["#8B4513", "#D2691E", "#CD853F", "#556B2F", "#6B8E23"],
                "Soft Autumn": ["#DEB887", "#DAA520", "#BC8F8F", "#D8BFD8", "#C0C0C0"],
                "Deep Summer": ["#4682B4", "#5F9EA0", "#8A2BE2", "#4B0082", "#7B68EE"],
                "Soft Summer": ["#D3D3D3", "#C0C0C0", "#A9A9A9", "#708090", "#778899"],
                "Deep Winter": ["#000080", "#800000", "#8B0000", "#2F4F4F", "#483D8B"],
                "Soft Winter": ["#708090", "#A9A9A9", "#C0C0C0", "#DCDCDC", "#F5F5F5"]
            };
            
            const paletteContainer = document.getElementById("colorPalette");
            paletteContainer.innerHTML = "";
            palettes[season].forEach(color => {
                const div = document.createElement("div");
                div.className = "color-box";
                div.style.backgroundColor = color;
                paletteContainer.appendChild(div);
            });
        }

        determineSeason("#FF5733");
