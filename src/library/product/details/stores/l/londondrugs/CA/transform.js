
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.manufacturerDescription = [{ text }];
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          const value = item.text.replace(/(.+)(\n+)(.+)/g, '$1:$2');
          item.text = value;
          text = text + (text ? ' | ' : '') + item.text;
        });
        text = text.replace(/:\s+:/g, ':');
        row.specifications = [{ text }];
      }

      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.variantInformation = [{ text }];
      }

      if (row.description || row.additionalDescBulletInfo || row.moreDescription) {
        if (row.moreDescription) {
          let text = '';
          row.moreDescription.forEach(item => {
            text = text + (text ? ' ' : '') + item.text;
          });
          row.description = [{ text }];
        } else {
          let text = '';
          if (row.description) {
            row.description.forEach(item => {
              text = text + (text ? ' ' : '') + item.text;
            });
          }
          let text2 = '';
          if (row.additionalDescBulletInfo) {
            row.additionalDescBulletInfo.forEach(item => {
              text2 = text2 + (text2 ? ' || ' : '') + item.text;
            });
            if (text !== '') {
              text = '|| ' + text2 + ' | ' + text;
            } else {
              text = '|| ' + text2;
            }
          }
          row.description = [{ text }];
        }
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
