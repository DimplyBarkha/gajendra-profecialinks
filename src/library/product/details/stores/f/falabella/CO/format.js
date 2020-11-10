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
        if (row.description) {
          row.description.forEach(item => {
            item.text = item.text.replace(/(\s?\n)+/g, ' ').trim();
          });
        }        
        if (row.specifications) {
          let info = [];          
          row.specifications.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
          });          
          row.specifications = [{'text':info.join(' || '),'xpath':row.specifications[0].xpath}];          
        }
        if (row.alternateImages) {
            row.alternateImages.forEach(item => {
              //item.text = item.text.replace("?wid=800&hei=800&qlt=70", '').trim();
            });
        }
        
        if (row.additionalDescBulletInfo) {
            row.additionalDescBulletInfo.forEach(item => {
              item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
            });
        }
        if (row.listPrice) {
            row.listPrice.forEach(item => {
              item.text = item.text.replace(/(\s*\(Precio\s+final\)\s*)+/g, '').trim();
            });
        }
        
        if (row.aggregateRatingText) {
          row.aggregateRatingText.forEach(item => {
            item.text = item.text.replace(/(\s?\n)+/g, ' | ').trim();
          });
        }
        if (row.shippingInfo) {
          row.shippingInfo.forEach(item => {
            item.text = item.text.replace(/(\s?\n)+/g, ' | ').trim();
          });
        }
        if (row.availabilityText) {
            row.availabilityText.forEach(item => {
                if (item.text == 'Out Of Stock'){
                    delete row.quantity;
                }
            });
        }
        if (row.promotion) {
            let info = [];          
            row.promotion.forEach(item => {
              info.push(item.text);            
            });          
            row.promotion = [{'text':info.join(' | '),'xpath':row.promotion[0].xpath}];          
        }        

      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };
  