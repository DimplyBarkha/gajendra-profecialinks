/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
      }
      const categs = [];
      const idx = 0;

      if (row.additionalDescBulletInfo) {
        let desc = '';
        row.additionalDescBulletInfo.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
          item.text = item.text.replace(/(\s?\n)+/g, ' | ').trim();
          desc = desc + '||' + item.text;
        });
        if (row.description) {
          row.description.forEach(item => {
            item.text = item.text + desc;
          });
        }
      }
      // aggregateRating
    }
  }
  return data;
};
module.exports = { transform };
