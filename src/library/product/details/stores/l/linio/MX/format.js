// @ts-nocheck
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
        let text = '';
        row.additionalDescBulletInfo.forEach(ele => {
          text += ele.text + ' || ';
        });
        row.additionalDescBulletInfo = [{ text: text.slice(0, -3).trim() }];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(ele => {
          text += ele.text + ' | ';
        });
        row.description = [{ text: text.slice(0, -2).trim() }];
        row.description[0].text = row.description[0].text.replace(/\n \n \n \n/g, ' || ').replace(/\n \n/g, ' : ') + ' | ' + row.additionalDescBulletInfo[0].text;
      }
      if (row.productOtherInformation) {
        let text = '';
        row.productOtherInformation.forEach(ele => {
          text += ele.text + ' || ';
        });
        row.productOtherInformation = [{ text: text.slice(0, -3).trim() }];
      }
      if (row.shippingInfo) {
        let text = '';
        row.shippingInfo.forEach(ele => {
          text += ele.text + ' ';
        });
        row.shippingInfo = [{ text: text.trim() }];
      }
      if (row.nameExtended && row.brandText) {
        row.nameExtended[0].text = row.brandText[0].text + ' - ' + row.nameExtended[0].text;
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
