/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const cleanUp = text => text.toString()
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
      if (row.unInterruptedPDP) {
        var arrTemp = [];
        row.unInterruptedPDP.forEach(item => {
          arrTemp.push(item.text);
        });
        if (arrTemp.length) {
          row.unInterruptedPDP = [{ text: arrTemp.join(' || ') }];
        }
      }
      if (row.description) {
        row.description[0].text = cleanUp(row.description[0].text);
      }

      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfoCount = [{ text: row.additionalDescBulletInfo.length }];
      }

      if (row.descriptionBullets) {
        row.descriptionBullets[0].text = row.descriptionBullets.length;
      }

      if (row.name && row.brandText) {
        if (!(row.name[0].text.indexOf(row.brandText[0].text) >= 0)) {
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.name[0].text }];
        }
      }

      if (row.directions) {
        row.directions[0].text = cleanUp(row.directions[0].text);
      }

      if (row.shippingInfo) {
        row.shippingInfo[0].text = cleanUp(row.shippingInfo[0].text);
      }

      if (row.warranty) {
        row.warranty[0].text = cleanUp(row.warranty[0].text);
      }

      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo = row.additionalDescBulletInfo.map((addInfo) => {
          return { text: cleanUp(addInfo.text) };
        });
      }

      if (row.countryOfOrigin) {
        let [text] = row.countryOfOrigin;
        text = text.text.split(' ').pop();
        row.countryOfOrigin[0].text = text;
      }
    }
  }
  return data;
};
module.exports = { transform };