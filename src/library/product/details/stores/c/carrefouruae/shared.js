
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
        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
             if(item.text.includes("https:")){
               item.text = item.text;
             }else{
              item.text = 'https:'+item.text;
             }
          });
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
        if (row.description) {
          row.description.forEach(item => {
             item.text = item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim();
          });
        }
        if (row.brandText) {
          row.brandText.forEach(item => {
             item.text = item.text.split(' ')[0];
          });
        }
        if (row.manufacturerDescription) {
          row.manufacturerDescription.forEach(item => {
             item.text = item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim();
          });
        }
        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ':')} || `;
          });
          row.specifications = [
            {
              text: text,
            },
          ];
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  