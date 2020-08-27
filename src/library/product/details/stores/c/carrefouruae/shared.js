
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    // Default transform function
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

        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += `${item.text} ||`;
          });
          row.specifications = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = item.text ? item.text.split(' ')[0] : '';
          });
        }
        if (row.productOtherInformation) {
          let text = '';
          row.productOtherInformation.forEach(item => {
            text += item.text.replace(/\n/g, ' ').trim();
          });
          row.productOtherInformation = [
            {
              text: text,
            },
          ];
        }
        if (row.availabilityText) {
          let text = '';
          row.availabilityText.forEach(item => {
            if(item.text.includes('TEMP OUT OF STOCK')) {
              item.text = 'Out of Stock'
            } else {
              item.text = 'In Stock'
            }
            
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  