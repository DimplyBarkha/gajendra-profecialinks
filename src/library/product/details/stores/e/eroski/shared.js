/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    console.log('INSIDE OF CLEANUP');
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '');

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (let row of group) {
      try {
        if (row.aggregateRating) {
          let text = '';
          row.aggregateRating.forEach(item => {
            text = item.text.replace(',', '.');
          });
          row.aggregateRating = [{ text }];
        }
        row = cleanUp(row);
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  return data;
};
module.exports = { transform };

// for (const { group } of data) {
//   for (const row of group) {
//     if (row.variantId) {
//       for (const item of row.variantId) {
//         item.text = item.text.replace('https://supermercado.eroski.es/images/', '');
//         item.text = item.text.replace('.jpg', '');
//       }
//     }
//   }
