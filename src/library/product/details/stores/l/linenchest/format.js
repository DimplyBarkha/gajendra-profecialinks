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
      if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0] && row.additionalDescBulletInfo[0].text.length > 1) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          item.text = item.text.replace('in', 'In').replace('out', 'Out');
        });
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text} | `;
        });
        row.description = [{ text: text.slice(0, -3), xpath: row.description[0].xpath }];
      }
      if (row.nameExtended) {
        var text = '';
        if (row.brandText) {
          text += row.brandText[0].text + ' - ';
        }
        text += row.nameExtended[0].text;
        row.nameExtended = [{ text: text, xpath: row.nameExtended[0].xpath }];
      }

      if (row.shippingDimensions) {
        if (row.shippingDimensions.length > 1) {
          row.shippingDimensions.shift();
        }
      }
      if (row.directions) {
        const directionsArray = row.directions.map((item) => {
          return item.text;
        });
        row.directions = [{ text: directionsArray.join(' | '), xpath: row.directions[0].xpath }];
      }
      if (row.specifications) {
        const specificationsArray = row.specifications.map((item) => {
          return item.text;
        });
        row.specifications = [{ text: specificationsArray.join(' || '), xpath: row.specifications[0].xpath }];
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = el.text && clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
