/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
    return data;
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let specs = '';
        row.specifications.forEach((item, index) => {
          if (index % 2 === 0) {
            specs += `${item.text} : `;
          } else {
            specs += `${item.text} || `;
          }
        });
        row.specifications = [{ text: specs }];
      }
      if (row.nameExtended) {
        let brandData = '';
        let nameExtended = '';
        if (row.brandText) {
          row.brandText.map((item) => {
            brandData = item.text;
          });
          row.nameExtended.map((item) => {
            nameExtended = item.text;
          });
          row.nameExtended = [{ text: `${brandData} - ${nameExtended}` }];
        }
      }
      if (row.alternateImages) {
        row.alternateImages.map((item) => {
          item.text = `${item.text.indexOf('https') === -1 ? 'https:' : ''}${item.text}`;
        });
      }
      if (row.price) {
        row.price.map(item => {
          item.text = `${item.text}€`;
        });
      }
    }
  }
  data = cleanUp(data, undefined);
  return data;
};

module.exports = { transform };
