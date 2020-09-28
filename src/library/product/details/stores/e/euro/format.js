/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          const locText = item.text;
          if (locText.indexOf('###') > 0) {
            item.text = locText.substring(0, locText.indexOf('###'));
          } else if (locText.indexOf('###') === 0) {
            item.text = locText.replace('###', '');
          }
          console.log(item.text);
        });
      }
      if (row.specifications) {
        const specs = [];
        let newTxt = '';
        let cnt = 0;
        row.specifications.forEach(item => {
          specs[0] = item;
          item.text = item.text.replace(/(\s?\n)+/g, ' ');
          if (cnt > 0) newTxt = newTxt + ' || ' + item.text;
          else newTxt = newTxt + item.text;
          cnt++;
        });
        specs.forEach(item => {
          item.text = newTxt;
        });
        row.specifications = specs;
      }
      if (row.description) {
        const descs = [];
        let newTxt = '';
        let cnt = 0;
        row.description.forEach(item => {
          descs[0] = item;
          item.text = item.text.replace(/(\s?\n)+/g, ' ').trim();
          if (cnt > 0) newTxt = newTxt + '||' + item.text;
          else newTxt = newTxt + item.text;
          cnt++;
        });
        descs.forEach(item => {
          item.text = newTxt;
        });
        row.description = descs;
      }
      if (row.price) {
        row.price = [
          {
            text: row.price[0].text.replace(' ', ''),
          },
        ];
      }
      if (row.listPrice) {
        row.listPrice = [
          {
            text: row.listPrice[0].text.replace(' ', ''),
          },
        ];
      }
    }
  }
  return data;
};
module.exports = { transform };
