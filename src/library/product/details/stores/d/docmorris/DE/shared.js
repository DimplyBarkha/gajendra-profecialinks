
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.pricePerUnit2) {
        let text = '';
        row.pricePerUnit2.forEach(item => {
          if (item.text.endsWith('/')) {
            text = item.text.slice(0, -1);
            console.log(text);
          } else {
            text = item.text;
          }
        });
        row.pricePerUnit2 = [
          {
            text,
          },
        ];
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = text + (`||${text}` ? ' || ' : ' ') + item.text;
        });
        row.description = [{ text }];
      }

      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.ingredientsList = [{ text }];
      }

      if (row.warnings) {
        let text = '';
        row.warnings.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.warnings = [{ text }];
      }

      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text = text + (text ? ' | ' : ' ') + item.text;
        });
        row.variants = [{ text }];
      }

      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text = text + (text ? ' | ' : ' ') + item.text;
        });
        row.variantInformation = [{ text }];
      }

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text = text + (`||${text}` ? ' || ' : '') + item.text;
        });
        row.additionalDescBulletInfo = [{ text }];
      }

      if (row.availabilityText) {
        let text = '';
        row.availabilityText.forEach(item => {
          if (item.text.includes('Derzeit nicht verfügbar')) {
            text = 'Out of Stock';
          } else if (item.text.includes('Verfügbar')) {
            text = 'In Stock';
          } else {
            text = 'In Stock';
          }
        });
        row.availabilityText = [{ text: text }];
      }

      if (row.price) {
        let text = '';
        row.price.forEach(item => {
          text = item.text.replace(/,/g, '.')
        });
        row.price = [{ text }];
      }

      if (row.listPrice) {
        let text = '';
        row.listPrice.forEach(item => {
          text = item.text.replace(/,/g, '.')
        });
        row.listPrice = [{ text }];
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
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
    el.text = el.text.trim();
  }))));

  return data;
};

module.exports = { transform };
