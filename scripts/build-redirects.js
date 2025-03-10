const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Output JSON file path
const outputFilePath = path.join(__dirname, '../_data/sitemap.json');

// Initialize an empty object to store key-value pairs
// {
//   data: [{
//    key: string,
//    value: string
//  }]
// }
const keyValuePairs = {
  data: []
};

// Read and parse the CSV file
fs.createReadStream('./_data/sitemap.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Add each row to the key-value pairs object
    keyValuePairs.data.push(row);
  })
  .on('end', () => {
    // Write the key-value pairs to a JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(keyValuePairs, null, 2));
    console.log('CSV file successfully converted to JSON.');
  });
