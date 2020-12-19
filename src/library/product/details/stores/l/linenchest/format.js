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
  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        const variantArray = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        row.additionalDescBulletInfo = [{ text: variantArray.join('||'), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          item.text = item.text.replace('in', 'In');
          item.text = item.text.replace('out', 'Out');
        });
      }
      if (row.description) {
        const descArray = row.description.map((item) => {
          return item.text;
        });
        row.description = [{ text: descArray.join('||'), xpath: row.description[0].xpath }];
        row.description.forEach(item => {
          item.text = item.text.replace(/\n \n/g, '||');
          item.text = item.text.replace(/\n/g, '||');
        });
      }
      if (row.imageZoomFeaturePresent) {
        let newText;
        row.imageZoomFeaturePresent.forEach(item => {
          if (item.text == 'true') {
            newText = 'Yes';
          }
        });
        row.imageZoomFeaturePresent = [{ text: newText }];
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
