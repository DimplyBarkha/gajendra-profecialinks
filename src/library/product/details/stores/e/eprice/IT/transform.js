/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const cleanUp = text => text.toString()
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
      if (row.alternateImages) {
        row.alternateImages.forEach(alternateImages => {
          alternateImages.text = alternateImages.text.replace('/75/', '/Lightbox/');
        });
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(manufacturerDescription => {
          text = manufacturerDescription.text.replace(/\n/g, '');
        });
        row.manufacturerDescription = [{
          text: cleanUp(text),
        }];
      }
      if (row.manufacturer) {
        row.manufacturer.shift();
        const text = '';
        row.manufacturer.forEach(manufacturer => {
          manufacturer.text = manufacturer.text.replace(": '", '');
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
