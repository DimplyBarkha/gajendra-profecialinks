
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/

const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {

      if (row.ratingCount) {
        let text = '';
        row.ratingCount.forEach(item => {
          text = JSON.parse(item.raw).aggregateRating.reviewCount;
        });
        row.ratingCount = [{ text }];
      }

      if (row.aggregateRating) {
        let rating = JSON.parse(row.aggregateRating[0].raw).aggregateRating.ratingValue
        rating = rating > 0 ? rating : ''
        row.aggregateRating = [{
          "text": rating,
          "raw": rating,
          "locale": "en_AU",
          "value": rating
        }]
      }

      if (row.variantId) {
        if (row.variantId[0].text.split(':')[1]) {
          let variantId = row.variantId[0].text.split(':')[1]
          row.variantId[0].text = variantId;
        }
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
    }
  }


  // Clean up data
  const clean = text => text.toString()
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

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };