
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        let text = '';
        row.availabilityText.forEach(item => {
          if (item.text === 'InStock') {
            text = 'In Stock';
          } else {
            text = 'Out Of Stock';
          }
        });
        row.availabilityText = [{ text }];
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.manufacturerDescription = [{ text }];
      }

      if (row.nameExtended) {
        let text = '';
        row.nameExtended.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.nameExtended = [{ text }];
      }

      if (row.manufacturerImages) {
        let text = '';
        let temp = 0;
        row.manufacturerImages.forEach(item => {
          const val = item.text.search('https');
          if (val < 0) {
            const rep = item.text.replace(/(.+, )(.+)( .+)/g, 'https:$2');
            item.text = rep;
            text = text + (text ? ' | ' : '') + item.text;
            temp++;
          }
        });
        if (temp > 0) {
          row.manufacturerImages = [{ text }];
        }
      }

      const text = '0';
      row.variantCount = [{ text }];

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          const value = item.text.replace(/\r\n|\r|\n/g, ':');
          item.text = value;
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.specifications = [{ text }];
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
  }))));

  return data;
};

module.exports = { transform };
