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
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.specifications.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + '||';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.specifications = nDesc;
      }

      if (row.variants) {
        const nvariants = [];
        let newText = '';
        row.variants.forEach(item => {
          nvariants[0] = item;
          newText = newText + item.text.replace('/item', '').replace('.html', '') + '|';
        });
        console.log(newText);
        nvariants.forEach(item => {
          if (newText.length > 0) newText = newText.substring(0, newText.length - 1);
          item.text = newText;
        });
        row.variants = nvariants;
      }
    }
  }
  return data;
};

module.exports = { transform };
