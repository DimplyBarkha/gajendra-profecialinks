/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '');

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.brandText) {
        row.brandText.forEach(item => {
          item.text = cleanUp(item.text);
          item.text = `${item.text.replace('Brand', '').trim()}`;
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          if ((item.text.includes('https:') === false)) {
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          if ((item.text.includes('https:') === false)) {
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.weightNet) {
        row.weightNet.forEach(item => {
          item.text = cleanUp(item.text);
          item.text = `${item.text.replace(':', '').trim()}`;
        });
      }
      if (row.sku) {
        row.sku.forEach(item => {
          item.text = cleanUp(item.text);
          item.text = `${item.text.replace('-', '').trim()}`;
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
