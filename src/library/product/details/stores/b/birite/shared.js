
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.description = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.productOtherInformation) {
        let text = '';
        row.productOtherInformation.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.productOtherInformation = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.alternateImages) {
        let text = '';
        const newAltImage = [];
        row.alternateImages.forEach(item => {
          text = item.text.replace('-147x116', '');
          newAltImage.push({ text });
        });
        row.alternateImages = newAltImage;
      }
      if (row.specifications) {
        let text = '';
        let rowCount = 0;
        row.specifications.forEach(item => {
          rowCount++;

          if (rowCount % 2 !== 0) {
            text += `${item.text} : `;
          } else {
            text += `${item.text} || `;
          }
        });
        row.specifications = [
          {
            text: (text.substr(text.length - 3) == '|| ' || text.substr(text.length - 3) == ' : ') ? text.slice(0, -3) : text,
          },
        ];
      }

      if (row.warranty) {
        let text = '';
        row.warranty.forEach(item => {
          const warrentyArr = item.text.match(/\d+/g);
          text = warrentyArr[0] + ' Years';
        });
        row.warranty = [
          {
            text: text,
          },
        ];
      }

      if (row.termsAndConditions) {
        let text = '';
        row.termsAndConditions.forEach(item => {
          text = (item.text) ? 'Yes' : 'No';
        });
        row.termsAndConditions = [
          {
            text,
          },
        ];
      }
      if (row.inTheBoxText) {
        row.inTheBoxText.forEach(elm => { elm.text = elm.text.replace('YES', '').replace(': Yes', ''); });
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
