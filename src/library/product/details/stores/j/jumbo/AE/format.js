/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.category) {
        if (row.category[0].text === 'Home') {
          row.category.shift();
        }
      }
      if (row.description) {
        row.description[0].text = row.description[0].text.replace(/\n \n/g, ' || ').replace(/\n/g, ' ');
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n \n \n \n/g, ' || ').replace(/\n \n/g, ' : ');
        });
      }
      if (row.variantCount) {
        row.variantCount = [{ text: 1 }];
      }
    }
  }
  return data;
};

module.exports = { transform };
