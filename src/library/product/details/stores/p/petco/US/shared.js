
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text = text + (text ? ' ' : ' ') + item.text;
        });
        row.additionalDescBulletInfo = [{ text }];
      }

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text = item.text.replace(/-/g, ' || ');
        });
        row.additionalDescBulletInfo = [{ text }];
      }

      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          if (item.text.includes(',')) {
            text = item.text.replace(/,/g, ' | ');
          } else {
            text = item.text;
          }
        });
        row.variants = [
          {
            text,
          },
        ];
      }

      if (row.alternateImages) {
        let text = '';
        row.alternateImages.forEach(item => {
          if (item.text.includes(',https')) {
            text = item.text.replace(/,https/g, ' | https');
          } else {
            text = item.text;
          }
        });
        row.alternateImages = [
          {
            text,
          },
        ];
      }

      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          if (item.text.includes(',')) {
            text = item.text.replace(/,/g, ' | ');
          } else {
            text = item.text;
          }
        });
        row.variantInformation = [
          {
            text,
          },
        ];
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = text + (text ? ' || ' : ' ') + item.text;
        });
        row.description = [{ text }];
      }

      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text = text + (text ? ' ' : ' ') + item.text;
        });
        row.ingredientsList = [{ text }];
      }

      if (row.availabilityText) {
        let text = '';
        row.availabilityText.forEach(item => {
          if (item.text === 'Available') {
            text = 'In Stock';
          } else {
            text = 'Out of Stock';
          }
        });
        row.availabilityText = [{ text }];
      }

      if (row.specifications) {
        let text = '';
        for (let i = 0; i < row.specifications.length; i++) {
          text += `${row.specificationsLabel[i].text} : ${row.specifications[i].text} || `;
        }
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
        delete row.specificationsLabel;
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
