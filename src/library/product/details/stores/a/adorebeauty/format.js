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
        if (row.description) {
          row.description[0].text = row.description[0].text.replace(/(\n\s*){5,}/g, '').replace(/(\n\s*){4,}/g, '').replace(/(\n\s*){2,}/g, ' || ');
          row.description[0].text = cleanUp(row.description[0].text);
        }

        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfoCount = [{ text: row.additionalDescBulletInfo.length }];
          row.descriptionBullets = [{ text: row.additionalDescBulletInfo.length }];
        }

        if (row.name && row.brandText) {
            row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.name[0].text }];
        }

        if(row.directions) {
            row.directions[0].text = cleanUp(row.directions[0].text);
        }

        if(row.shippingInfo) {
            row.shippingInfo[0].text = cleanUp(row.shippingInfo[0].text);
        }

        if(row.ratingCount) {
            row.ratingCount[0].text = cleanUp(row.ratingCount[0].text.replace(/[^\d]/gm, ''));
        }
      }
    }
    return data;
  };
module.exports = { transform };