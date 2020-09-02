/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variants) {
        const variantArray = row.variants.map((item) => {
          return item.text;
        });
        row.variants = [{ text: variantArray.join('|'), xpath: row.variants[0].xpath }];
      }
      if (row.shippingInfo) {
        const shippingInfoArray = row.shippingInfo.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/gm, ' ') : '';
        });
        row.shippingInfo = [{ text: shippingInfoArray.join('|'), xpath: row.shippingInfo[0].xpath }];
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/gm, '| ') : '';
        });
        row.specifications = [{ text: specificationsArr.join('|'), xpath: row.specifications[0].xpath }];
      }
    }
  }

  return data;
};

module.exports = { transform };
