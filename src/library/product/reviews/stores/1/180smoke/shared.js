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

  for (const { group }
    of data) {
    for (const row of group) {
      if (row.brand) {
        row.brand.forEach(item => {
          if (item.text.includes('smok') || item.text.includes('Smok') || item.text.includes('SMOK')) {
            item.text = 'Smok';
          } else if (item.text.includes('Juul') || item.text.includes('juul') || item.text.includes('JUUL')) {
            item.text = 'Juul';
          } else if (item.text.includes('Stlth') || item.text.includes('stlth') || item.text.includes('STLTH')) {
            item.text = 'Stlth';
          } else if (item.text.includes('Vuse') || item.text.includes('vuse') || item.text.includes('VUSE')) {
            item.text = 'Vuse';
          } else {
            item.text = item.text;
          }
        });
      }
      if (row.flavour) {
        row.flavour.forEach(item => {
          item.text = item.text.replace(":","");
        });
      }
      if (row.reviewDate) {
        row.reviewDate.forEach(item => {
          item.text = item.text.replace("- 0:00 -","").trim();
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
