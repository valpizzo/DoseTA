const fs = require('fs');

const urls = [
  'https://dose-health-coding-challenge.s3.amazonaws.com/Group01.csv',
  'https://dose-health-coding-challenge.s3.amazonaws.com/Group02.csv',
  'https://dose-health-coding-challenge.s3.amazonaws.com/Group03.csv',
  'https://dose-health-coding-challenge.s3.amazonaws.com/Group04.csv',
  'https://dose-health-coding-challenge.s3.amazonaws.com/Group05.csv',
  'https://dose-health-coding-challenge.s3.amazonaws.com/Group06.csv',
  'https://dose-health-coding-challenge.s3.amazonaws.com/Group07.csv',
  'https://dose-health-coding-challenge.s3.amazonaws.com/Group08.csv',
  'https://dose-health-coding-challenge.s3.amazonaws.com/Group09.csv',
  'https://dose-health-coding-challenge.s3.amazonaws.com/Group10.csv',
]

const countZips = (groups) => {
  const zipCounts = {};

  groups.map(group => {
    // Breaks each group of data into rows, and removes the header row
    const groupRows = group.split('\r');
    groupRows.shift();

    groupRows.map(row => {
      // Pulls just the zipcode out of the row by slicing off any text after the last comma
      const zip = row.slice(row.lastIndexOf(',') + 1);

      // If this zipcode has not been seen, a new key for that zipcode is added to the zipCounts object with a value of 1
      // If this zipcode has been seen, the value at that key increases by 1
      if (zipCounts[zip] === undefined) {
        zipCounts[zip] = 1;
      } else {
        zipCounts[zip]++;
      }
    });
  });

  return zipCounts;
}

// Function that fetches CSV data and ultimately write a the Zipcode Summary file
const createZipSummary = () => {
  // 'groups' will be an array where each element contains the text of each CSV (as a promise)
  const groups = urls.map(url => {
    // Fetches data from each element in the urls array
    return fetch(url, {
      method: 'get',
      headers: {
        'content-type': 'text/csv;charset=UTF-8',
      }
    })
    // Take the data from each url and turn it into text
    .then(res => res.text());
  });

  // Waits for each promise in the 'groups' array to resolve
  Promise.all(groups)
    // Passes the array of resolved promises through the countZips function which returns an object of zip counts
    .then(values => countZips(values))
    // Writes a text file summarizing the zip counts for each zip code
    .then(zipCounts => {
      fs.writeFile('zipSummary.txt', JSON.stringify(zipCounts, null, 2), err => {
        if (err) {
          console.log(err);
        }
      });
    });
}

createZipSummary();