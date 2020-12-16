/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const cleanUp = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text} | `;
        });
        row.description = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text} || `;
        });
        row.specifications = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.mpc) {
        const text = '';
        row.mpc.forEach(item => {
          if (item.text.includes('(.+)')) { item.text = ''; }
        });
        row.mpc = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.aggregateRating) {
        const ratingArr = [];
        row.aggregateRating.forEach(item => {
          if (item.text.includes('tpw-star tpw-star-full')) {
            ratingArr.push(1);
          } else ratingArr.push(0);
        });
        const aggregateRating = ratingArr.reduce(function (a, b) {
          return a + b;
        }, 0);
        row.aggregateRating = [
          {
            text: cleanUp(aggregateRating),
          },
        ];
      }
    }
  }

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = cleanUp(el.text);
  }))));

  return data;
};
module.exports = { transform };
