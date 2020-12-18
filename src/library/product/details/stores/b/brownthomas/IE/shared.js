
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.manufacturerDescription = [{ text }];
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = text + (text ? ' || ' : '') + item.text;
        });
        row.description = [{ text }];
      }

      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          if (item.text.startsWith('|')) {
            item.text = item.text.replace('|', '');
          }
        });
      }

      if (row.videos) {
        row.videos.forEach(item => {
          if (item.text.startsWith('|')) {
            item.text = item.text.replace('|', '');
          }
        });
      }

      if (row.specifications) {
        row.specifications.forEach(item => {
          if (item.text.startsWith('|')) {
            item.text = item.text.replace('|', '');
          }
        });
      }

      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.variantInformation = [{ text }];
      }

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text = text + (text ? ' || ' : '') + item.text;
        });
        row.additionalDescBulletInfo = [{ text }];
      }

      if (row.inTheBoxText) {
        let text = '';
        if (row.inTheBoxText.length === 1) {
          const item = row.inTheBoxText[0].text;
          text = item.includes('?') ? item.split('?')[1] : item;
          row.inTheBoxText = [{ text }];
        };
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
