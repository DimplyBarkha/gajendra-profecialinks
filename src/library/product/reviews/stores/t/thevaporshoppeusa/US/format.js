
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  for (const { group } of data) {
    for (const row of group) {
      if (row.productFamily) {
        let productFamily1 = '';
        row.productFamily.forEach(item => {
          productFamily1 += `${item.text}` + '/';
        });
        productFamily1 = productFamily1.slice(0, -1).trim();
        row.productFamily = [
          {
            text: productFamily1,
          },
        ];
      } if (row.flavour) {
        let flavour1 = '';
        row.flavour.forEach(item => {
          item.text = item.text.replace('%', '').trim();
          item.text = item.text.replace('.', '').trim();
          item.text = item.text.replace(/[0-9]/g, '').trim();
          flavour1 += `${item.text}` + ',';
        });
        var lastChar = flavour1.slice(-1);
        if (lastChar === ',') {
          flavour1 = flavour1.slice(0, -1);
        }
        const flavourArray = flavour1.split(',');
        var uniqueArray = flavourArray.filter(function (item, pos) {
          return flavourArray.indexOf(item) === pos;
        });
        flavour1 = uniqueArray.join(',');

        row.flavour = [{ text: flavour1 }];
      }
    }
  }
  return data;
};

module.exports = { transform };
