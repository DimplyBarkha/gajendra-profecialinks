/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
      if (row.category) {
        let newText = '';
        row.category.forEach(item => {
          newText += item.text + ' > ';
        });
        newText = newText.slice(0, -3);
        row.category = [{ text: newText }];
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          if(item.text.toLowerCase().includes('glo')){
            item.text = 'GLO';
          }
          else if(item.text.toLowerCase().includes('iqos')){
            item.text = 'IQOS';
          }
        });
      }
    }
  }

  return data;
};

module.exports = { transform };
