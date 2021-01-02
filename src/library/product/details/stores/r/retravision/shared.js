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
      if (row.Image360Present) {
        let newText = 'No';
        row.Image360Present.forEach(item => {
          if (item.text.trim() > 0) {
            newText = 'YES';
          }
        });
        row.Image360Present = [{ text: newText }];
      }

      if (row.availabilityText) {
        let newText = 'Out Of Stock';
        row.availabilityText.forEach(item => {
          if (item.text.trim() === 'instock') {
            newText = 'In Stock';
          }
        });
        row.availabilityText = [{ text: newText }];
      }

	  if (row.description) {
        let newText = '';
        row.description.forEach(item => {
          newText = newText + item.text + '||';
        });
        newText = newText.substring(0, newText.length - 2);
        row.description = [{ text: newText }];
      }

      if (row.specifications) {
        let newText = '';
        row.specifications.forEach(item => {
          newText = newText + item.text + '|';
        });
        newText = newText.substring(0, newText.length - 1);
        row.specifications = [{ text: newText }];
      }

      if (row.productOtherInformation) {
        let newText = '';
        row.productOtherInformation.forEach(item => {
          newText = newText + item.text + '|';
        });
        newText = newText.substring(0, newText.length - 1);
        row.productOtherInformation = [{ text: newText }];
      }
    }
  }

  return data;
};

module.exports = { transform };
