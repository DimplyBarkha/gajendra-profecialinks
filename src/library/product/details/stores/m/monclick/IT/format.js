/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.replace(/\n \n/g, ' || ');
      }
      if (row.description) {
        row.description[0].text = row.description[0].text.replace(/\n \n/g, ' || ').replace(/\n/g, ' ').replace(/-/g, '');
      }
      if (row.specifications) {
        let demo = '';
        row.specifications.forEach(item => {
          demo += item.text.replace(/\n \n \n \n/g, ' : ') + ' || ';
        });
        row.specifications = [{ text: demo.slice(0, -3).trim() }];
      }
      if (row.price) {
        let amt = '';
        amt = row.price[0].text.split('\n', 1)[0];
        row.price = [{ text: amt }];
      }
      row.variantCount = [{ text: 1 }];
    }
  }
  return data;
};

module.exports = { transform };
