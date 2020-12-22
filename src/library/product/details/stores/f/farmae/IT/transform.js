/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // Default transform function
  const clean = (text) =>
    text
      .toString()
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
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) =>
        row[header].forEach((el) => {
          el.text = clean(el.text);
        }))));

  for (const { group } of data) {
    for (const row of group) {
      try {


        if (row.availabilityText) {
          row.availabilityText = [
            { text: row.availabilityText[0].text === 'Disponibile' ? 'In Stock' : 'Out of Stock' },
          ];
        }

        if (row.sku) {
          // console.log(row.sku);
          var obj = JSON.parse(row.sku[0].text);

          // console.log(obj.sku);
          row.sku = [{ text: obj.sku }];
        }
     
        if (row.aggregateRating) {
         
          var ratobj = JSON.parse(row.aggregateRating[0].raw);
          row.aggregateRating = [{ text: ratobj.aggregateRating.ratingValue }];
          console.log(ratobj);
        }
        if (row.ratingCount) {
          // console.log(row.ratingCount);
          var reviewcntobj = JSON.parse(row.ratingCount[0].raw);
          row.ratingCount = [{ text: reviewcntobj.aggregateRating.reviewCount }];
        }
      } catch (exception) {
        console.log('Error in transform', exception);
      }
    }
  }
  return data;
};

module.exports = { transform };
