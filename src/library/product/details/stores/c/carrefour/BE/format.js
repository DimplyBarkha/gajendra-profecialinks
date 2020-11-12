
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
      // .replace(/"\s{1,}/g, '"')
      // .replace(/\s{1,}"/g, '"')
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
      if (row.iamge) {
        row.iamge.forEach(item => {
          item.text = 'https://drive.carrefour.eu' + item.text;
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = 'https://drive.carrefour.eu' + item.text;
        });
      }
      if (row.brandText) {
        if (row.nameExtended) {
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.nameExtended[0].text }];
        }
      }
      if (row.specifications) {
        var specificationsArr = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n/g, ' : ');
          item.text = item.text.replace(/\s*:\s*/g, ' : ');
          specificationsArr.push(item.text);
        });
        if (specificationsArr.length) {
          row.specifications = [{ text: specificationsArr.join(' || ') }];
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
