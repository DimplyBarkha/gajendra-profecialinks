
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
      if (row.specifications) {
        const specificationArray = row.specifications.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/g, ' : ') : ' ';
        });
        row.specifications = [{ text: specificationArray.join('|'), xpath: row.specifications[0].xpath }];
      }
      if (row.promotion) {
        const promotionArray = row.promotion.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n/g, ' : ').replace(/\n/g, '') : ' ';
        });
        row.promotion = [{ text: promotionArray.join('|'), xpath: row.promotion[0].xpath }];
      }
      row = cleanUp(row);
    }
  }
  return data;
};

module.exports = { transform };
