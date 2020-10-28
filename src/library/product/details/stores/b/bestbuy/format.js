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
        let tmp_desc = ''
        if (row.price) {            
            row.price.forEach(item => {
                item.text = item.text.replace(/(\s*,\s*)+/isg, '').trim();
            });
        }
        if (row.listPrice) {            
          row.listPrice.forEach(item => {
              item.text = item.text.replace(/(\s*Antes\s*)+/isg, '').trim();
              item.text = item.text.replace(/(\s*,\s*)+/isg, '').trim();
          });
        }
        if (row.promotion) {            
            row.promotion.forEach(item => {
                item.text = item.text.replace(/(\s*AHORRA\s*)+/isg, '').trim();
            });
        }
        if (row.videos) {            
            row.videos.forEach(item => {
                item.text = item.text.replace(/(\s*img.youtube\s*)+/isg, 'youtube').trim();
                item.text = item.text.replace(/(\s*\/vi\/\s*)+/isg, '/watch?v=').trim();
                item.text = item.text.replace(/(\s*\/mqdefault.jpg\s*)+/isg, '').trim();
            });
        }
        if (row.description2) {
            let info = [];          
            row.description2.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());            
            });
            row.descriptionBullets = [{'text': info.length}];
            tmp_desc = info.join(' || ');
            delete row.description2;
        }
        if (row.description && tmp_desc != '') {            
            row.description.forEach(item => {
                item.text = item.text.replace(/(\s*\n\s*)+/g, ' | ').trim();
                item.text = item.text + " || " + tmp_desc;
            });
        }
        if (row.ratingCount) {            
            row.ratingCount.forEach(item => {
                item.text = item.text.replace(/(\s*\(|\)\s*)+/isg, '').trim();
            });
        }
        if (row.specifications) {
            let info = [];          
            row.specifications.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
            });          
            row.specifications = [{'text':info.join(' || '),'xpath':row.specifications[0].xpath}];          
        }
        if (row.warranty) {
            let info = [];          
            row.warranty.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
            });          
            row.warranty = [{'text':info.join(' | '),'xpath':row.warranty[0].xpath}];          
        }
        if (row.weightNet) {
            let info = [];          
            row.weightNet.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
            });          
            row.weightNet = [{'text':info.join(' | '),'xpath':row.weightNet[0].xpath}];          
        }
        if (row.shippingDimensions) {
            let info = [];          
            row.shippingDimensions.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
            });          
            row.shippingDimensions = [{'text':info.join(' | '),'xpath':row.shippingDimensions[0].xpath}];          
        }
        if (row.variantInformation) {
          let info = [];          
          row.variantInformation.forEach(item => {
            info.push(item.text.trim());            
          });          
          row.variantInformation = [{'text':info.join(' | '),'xpath':row.variantInformation[0].xpath}];          
        }
        if (row.variants) {
          let info = [];          
          row.variants.forEach(item => {
            info.push(item.text.trim());            
          });            
          row.variants = [{'text':info.join(' | '),'xpath':row.variants[0].xpath}];          
          row.variantCount = [{'text':info.length,'xpath':row.variants[0].xpath}];
        }        
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };