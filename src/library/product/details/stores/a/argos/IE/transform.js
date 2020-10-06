
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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

  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        const text = row.description.map(elm => elm.text.replace(/<li([^>]*)>/g, '<li> || ').replace(/(<([^>]+)>)/ig, '').trim());
        row.description = [{ text: text.join(' | ') }];
      }
      if (row.specifications) {
        const text = row.specifications.map(elm => elm.text.trim()).join(' | ');
        row.specifications = [{ text }];
      }
      if (row.productOtherInformation) {
        const text = row.productOtherInformation.map(elm => elm.text.trim()).join(' | ');
        row.productOtherInformation = [{ text }];
      }
      if (row.availabilityText) {
        const avail = row.availabilityText[0].text.toLowerCase();
        const text = avail.includes('home delivery not available') ? 'In Store Only' : avail.includes('currently out of stock') ? 'Out of Stock' : 'In Stock';
        row.availabilityText = [{ text }];
      } else {
        row.availabilityText = [{ text: 'Out of Stock' }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = { transform };
