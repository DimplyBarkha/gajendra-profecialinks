
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variantId && row.sku) {
        row.variantId = [{ text: `${row.sku[0].text}${row.variantId[0].text}` }];
      }

      if (row.description) {
        let descText = row.description[0].text;
        descText = descText.replace('Read More', '');
        descText = descText.replace(/•/g, '||');
        row.description = [{ text: descText }];
        const bulletsInDesc = descText.split('||');
        if (bulletsInDesc.length) {
          row.descriptionBullets = [{ text: bulletsInDesc.length - 1 }];
        }
      }

      if (row.nameExtended && row.quantity) {
        row.nameExtended = [{ text: `${row.nameExtended[0].text} ${row.quantity[0].text}` }];
      }

      if (row.alternateImages) {
        row.secondaryImageTotal = [{ text: row.alternateImages.length }];
      }
    }
  }

  // Clean up data
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
