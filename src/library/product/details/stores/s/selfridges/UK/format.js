/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group }
    of data) {
    for (const row of group) {
      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text = text + (text ? ' | ' : ' ') + item.text;
        });
        row.variantInformation = [{ text }];
      }

      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          if (item.text.includes(',')) {
            text = text.replace(/,/g, ' | ');
          }
        });
        row.variants = [{ text }];
      }

      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
        });
      }

      if (row.variantCount) {
        if (row.variantCount[0].text == 1) { row.variantCount[0].text = 0; }
      }

      if (row.availabilityText) {
        let text = '';
        row.availabilityText.forEach(item => {
          if (item.text.toLowerCase() === 'instock') {
            text = 'In Stock';
          } else if (item.text.toLowerCase() === 'outofstock') {
            text = 'Out of Stock';
          } else {
            text = item.text;
          }
        });
        row.availabilityText = [
          {
            text,
          },
        ];
      }
    }
  }
  const cleanUp = (data, context) => {
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
  return cleanUp(data);
};

module.exports = { transform };
