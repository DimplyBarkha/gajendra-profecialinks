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
        row.description1[0].text = row.description1[0].text.replace(/\n \n/g, ' ');
        let demo = '';
        row.description2.forEach(item => {
          demo += item.text.replace(/\n \n \n \n/g, ' : ') + '  ';
        });
        row.description2 = [{ text: demo.slice(0, -1).trim() }];
        row.description[0].text = row.description[0].text.replace(/\n - /g, ' || ').replace(/\n \n-/g, ' || ').replace(/\n \n \n \n/g, ' ').replace(/\n \n \n/g, ' ').replace(/\n \n/g, ' ').replace(/\n/g, ' ');
        const info = row.description[0].text;
        const count = info.split('||').length - 1;
        if (count > 1) {
          row.descriptionBullets = [{
            text: count,
          }];
        }
        row.description[0].text = row.description1[0].text + ' | ' + row.description[0].text + ' | ' + row.description2[0].text;
      }
      if (row.availabilityText) {
        row.availabilityText = row.availabilityText[0].text.includes('Non disponibile') ? [{ text: 'Out of Stock' }] : [{ text: 'In Stock' }];
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
