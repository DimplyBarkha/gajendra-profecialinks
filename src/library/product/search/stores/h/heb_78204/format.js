// @ts-nocheck
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const clean = text => text.toString().replace(/\r\n|\r|\n/gm, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]/g, '');

  for (const { group } of data) {
    for (const row of group) {
      console.log('aggregateRating2Arr.length =====> ');
      if (row.aggregateRating2) {
        const aggregateRating2Arr = row.aggregateRating2.map((item) => {
          return item.text;
        });
        let rating = aggregateRating2Arr.length;
        if (aggregateRating2Arr.includes('/img/stars/smallstaron_50.png')) {
          rating = rating - 0.5;
        }
        row.aggregateRating2 = [{ text: rating.toString(), xpath: row.aggregateRating2[0].xpath }];
      }
    }
  }
  data.forEach(obj =>
    obj.group.forEach(row =>
      Object.keys(row).forEach(header =>
        row[header].forEach(el => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );
  return data;
};

module.exports = { transform };
