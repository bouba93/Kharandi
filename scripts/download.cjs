const https = require('https');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    console.log('Downloading from:', url);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        console.log('Redirecting to:', response.headers.location);
        return resolve(download(response.headers.location, dest));
      }
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
      }
    }).on('error', (err) => {
      reject(err.message);
    });
  });
}

const destDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

download('https://drive.google.com/uc?export=download&id=1xbr6dnlpsIjKuu6h3AH-HCatVLwAfD4o', path.join(destDir, 'animation.mp4'))
  .then(() => console.log('Downloaded successfully'))
  .catch(console.error);
