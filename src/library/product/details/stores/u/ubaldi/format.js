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
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfoArray = row.additionalDescBulletInfo.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/gm, '| ') : '|';
        });
        row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArray.join('|'), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.specifications) {
        const specificationsArray = row.specifications.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/gm, '| ') : '';
        });
        row.specifications = [{ text: specificationsArray.join('|'), xpath: row.specifications[0].xpath }];
      }
    }
  }

  return data;
};

module.exports = { transform };
