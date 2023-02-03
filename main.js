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
    const groupRows = group.split('\r');

    groupRows.map(row => {
      const zip = row.slice(row.lastIndexOf(',') + 1);

      if (zipCounts[zip] === undefined) {
        zipCounts[zip] = 1;
      } else {
        zipCounts[zip]++;
      }
    });
  });

  return zipCounts;
}

const createZipSummary = () => {
  const groups = urls.map(url => {
    return fetch(url, {
      method: 'get',
      headers: {
        'content-type': 'text/csv;charset=UTF-8',
      }
    })
    .then(res => res.text());
  });

  Promise.all(groups)
    .then(values => countZips(values))
    .then(zipCounts => {
      fs.writeFile('zipSummary.txt', JSON.stringify(zipCounts, null, 2), err => {
        if (err) {
          console.log(err);
        }
      });
    });
}

createZipSummary();