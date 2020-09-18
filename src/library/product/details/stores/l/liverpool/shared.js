
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
        if (row.availabilityText) {
          row.availabilityText.forEach(item => { 
            if(item.text.includes('InStock')) {
              item.text = "In Stock"
            } else {
              item.text = "Out of Stock"
            }
          })
        }
        if (row.videos) {
          row.videos.forEach(item => {
            item.text = item.text+'.mp4';
          });
        }
        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
            if((item.text.includes('https:')) ||(item.text.includes('http:'))){
            item.text = item.text
            }else{
              item.text = 'https:'+item.text;
            }
          });
        }
        if (row.promotion) {
          let text = '';
          row.promotion.forEach(item => {
            text += ` || ${item.text.trim()}`;
          });
          row.promotion = [
            {
              text: text.trim(),
            },
          ];
        }
        if (row.additionalDescBulletInfo) {
          let text = '';
          row.additionalDescBulletInfo.forEach(item => {
            text += ` || ${item.text.trim()}`;
          });
          row.additionalDescBulletInfo = [
            {
              text: text.trim(),
            },
          ];
        }

        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += ` || ${item.text}  `;
          });
          row.specifications = [
            {
              text: text.trim(),
            },
          ];
        }
    
      }
    }
    return data;
  };
  
  module.exports = { transform };
  