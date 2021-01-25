/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = data => {
  const cleanUp = (data, context) => {
    const clean = text =>
      text
        .toString ()
        .replace (/\r\n|\r|\n/g, ' ')
        .replace (/&amp;nbsp;/g, ' ')
        .replace (/&amp;#160/g, ' ')
        .replace (/\u00A0/g, ' ')
        .replace (/\s{2,}/g, ' ')
        .replace (/"\s{1,}/g, '"')
        .replace (/\s{1,}"/g, '"')
        .replace (/^ +| +$|( )+/g, ' ')
        // eslint-disable-next-line no-control-regex
        .replace (/[\x00-\x1F]/g, '')
        .replace (/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    data.forEach (obj =>
      obj.group.forEach (row =>
        Object.keys (row).forEach (header =>
          row[header].forEach (el => {
            el.text = clean (el.text);
          })
        )
      )
    );
    return data;
  };
  for (const {group} of data) {
    var rank = 1, gtinStr = '';
    for (let row of group) {
      if (row.brandText) {
        row.brandText.forEach (item => {
          var obj = JSON.parse (item.text);
          item.text = obj.brand;
          gtinStr = obj.gtin13;
        });
        row.gtin = [{text: gtinStr}];
      }
      if (row.image) {
        row.image.forEach (item => {
          item.text = item.text.replace ('?sw=20', '?sw=650');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach (item => {
          item.text = item.text.replace ('?sw=20', '?sw=650');
        });
      }
      if (row.availabilityText) {
        row.availabilityText.forEach (item => {
          if (item.text == 'true') {
            item.text = 'In Stock';
          } else {
            item.text = 'Out Of Stock';
          }
        });
      }
    }
  }
  return cleanUp (data);
};
module.exports = {transform};
