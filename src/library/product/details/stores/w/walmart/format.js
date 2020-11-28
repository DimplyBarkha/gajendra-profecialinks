/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
      }))));
      return data;
    };
    
    for (const { group } of data) {
      for (let row of group) {
        if (row.alternateImages) {
            row.alternateImages.forEach(item => {                    
                item.text = item.text.replace('background-image: url("', '').trim();
                item.text = item.text.replace('");', '').trim();
            });
        }
        if (row.brandLink) {
            row.brandLink.forEach(item => {
                item.text = "https://www.walmart.ca" + item.text;
            });
        }
        if (row.ratingCount) {
            row.ratingCount.forEach(item => {                    
                item.text = item.text.replace(/[( | )]/g, '').trim();
            });
        }
        if (row.aggregateRating) {
            row.aggregateRating.forEach(item => {                    
                item.text = item.text.replace(/[This product is rated | stars out of 5 stars)]/g, '').trim();
                item.text = item.text.slice(0,-1);
            });
        }
        if (row.availabilityText) {                    
            row.availabilityText.forEach(item => {
              item.text = "In Stock";
            });          
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };