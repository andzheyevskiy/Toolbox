const fs = require('fs');
const path = require('path');

function minifyFile(originalFilePath, newFilePath) {
    // Read the original file as text
    fs.readFile(originalFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // Minify the content by removing comments and extra whitespace
        const minifiedContent = data.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/\s+/g, ' ').trim();

        // Write the minified content to the new file
        fs.writeFile(newFilePath, minifiedContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }

            console.log('File successfully minified and saved to:', newFilePath);
        });
    });
}
