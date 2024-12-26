async function analyzeImage() {
    var fileInput = document.getElementById('fileInput');
    var resultDiv = document.getElementById('result');
  
    if (fileInput.files.length > 0) {
      var file = fileInput.files[0];
      var img = await loadImage(file);
  
      var gray = new cv.Mat();
      cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY, 0);
      var blurred = new cv.Mat();
      cv.GaussianBlur(gray, blurred, {width: 25, height: 25}, 0, 0, cv.BORDER_DEFAULT);
      var thresh = new cv.Mat();
      cv.threshold(blurred, thresh, 200, 255, cv.THRESH_BINARY);
  
      var contours = new cv.MatVector();
      var hierarchy = new cv.Mat();
      cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  
      var hasWater = false;
      for (let i = 0; i < contours.size(); i++) {
        var cnt = contours.get(i);
        var area = cv.contourArea(cnt);
        if (area > 5000) {
          hasWater = true;
          break;
        }
      }
  
      if (hasWater) {
        resultDiv.textContent = 'Se detectó agua estancada. Podría haber criaderos de mosquitos.';
      } else {
        resultDiv.textContent = 'No se detectó agua estancada. No hay criaderos de mosquitos.';
      }
  
      contours.delete();
      hierarchy.delete();
      gray.delete();
      blurred.delete();
      thresh.delete();
      img.delete();
    } else {
      alert('Por favor selecciona una imagen.');
    }
  }
  
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = () => {
        var img = new Image();
        img.onload = () => {
          var mat = cv.imread(img);
          resolve(mat);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  