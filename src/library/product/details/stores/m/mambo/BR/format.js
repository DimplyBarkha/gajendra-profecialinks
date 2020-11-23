
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
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace('&height=400', '');
          item.text = item.text.replace('&width=400', '');
          item.text = 'https://www.mambo.com.br' + item.text;
        });
      }
      if (row.alternateImages) {
        row.alternateImages.splice(0, 1);
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('&height=80', '');
          item.text = item.text.replace('&width=80', '');
          item.text = 'https://www.mambo.com.br' + item.text;
        });
      }
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          item.text = 'https://www.mambo.com.br' + item.text;
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.nameExtended) {
        if (row.brandText) {
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.nameExtended[0].text }];
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
