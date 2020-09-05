const { CLIEngine } = require('eslint');

/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        console.log('ROW SPECIFICATIONS =>', row.specifications);
        const specifications = row.specifications.map((item) => {
          return item.text;
        });
        row.specifications = [{ text: specifications.join('||') }];
      }
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfo = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        row.additionalDescBulletInfo = [{ text: additionalDescBulletInfo.join('|'), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
    }
  }

  return data;
};

module.exports = { transform };
