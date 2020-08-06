
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
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  for (const { group } of data) {
    for (const row of group) {
      // Hack: Escaping new lines in the text
      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text += item.text.replace(/\n/g, ' ');
        });
        row.directions = [
          {
            text: `${row.directionsTitle ? row.directionsTitle[0].text : ''} ${text} ${row.servingSuggest ? '|| ' + row.servingSuggest[0].text : ''}`.trim(),
          },
        ];
        delete row.directionsTitle;
        delete row.servingSuggest;
      }

      if (row.description) {
        row.additionalDescBulletInfo = row.description;
      }

      if (row.availabilityText) {
        for (const item of row.availabilityText) {
          if (item.text.includes('Out of Stock')) {
            delete row.price;
          }
        }
      }

      if (row.allergyAdvice) {
        let text = '';
        row.allergyAdvice.forEach(item => {
          text += `${item.text},`;
        });
        row.allergyAdvice = [
          {
            text: text.slice(0, -1),
          },
        ];
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `|| ${item.text} `;
        });
        row.description = [
          {
            text: `${text.trim()} `,
          },
        ];
      }

      if (row.manufacturer) {
        let text = '';
        if (row.manufacturer[0].text.match(/bottle/ig) || row.manufacturer[0].text.match(/produce/ig)) {
          text = row.manufacturer[1].text;
        } else {
          text = row.manufacturer[0].text;
        }
        row.manufacturer = [
          {
            text: `${text.replace(',', '').trim()}`,
          }
        ];
      }

      if (row.image) {
        if (row.image[0].text.match(/no-image/ig) && !row.image[0].text.match(/http/ig)) {
          row.image[0].text = `https://www.bestwaywholesale.co.uk${row.image[0].text}`
        }
      }
    }
  }
  return data;
};

module.exports = { transform };
