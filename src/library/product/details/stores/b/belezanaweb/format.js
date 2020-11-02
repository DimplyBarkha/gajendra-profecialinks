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
        let tmp_desc = '';
        let brand = '';
        if (row.promotion) {            
            row.promotion.forEach(item => {
                item.text = item.text.replace(/(\s*\(|de\s+desconto|\)\s*)+/isg, '').trim();
            });
        }
        if (row.videos) {            
            row.videos.forEach(item => {
                item.text = "https://www.youtube.com/watch?v=" + item.text;                
            });
        }
        if (row.brandText) {            
          row.brandText.forEach(item => {
              brand = item.text;
          });
        }
        if (row.aggregateRating) {            
          row.aggregateRating.forEach(item => {
              item.text = item.text.replace(/(\s*\.\s*)+/g, ',').trim();
          });
        }
        if (row.nameExtended) {            
          row.nameExtended.forEach(item => {
              if (brand != ''){
                item.text = item.text + " - " + brand;
              }
          });
        }
        if (row.availabilityText) {            
          row.availabilityText.forEach(item => {
              if (item.text != 'In Stock'){
                row.quantity = [{'text':'0'}];
              }
          });
        }
        if (row.description2) {
            let info = [];          
            row.description2.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());            
            });            
            tmp_desc = info.join(' || ');
            delete row.description2;
        }
        if (row.description) {
            let info = [];
            row.description.forEach(item => {
                info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
            });
            if(tmp_desc != ''){
                info.push(tmp_desc);
            }
            row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
        }
        if (row.ratingCount) {            
            row.ratingCount.forEach(item => {
                item.text = item.text.replace(/(\s*\(|\)\s*)+/isg, '').trim();
            });
        }        
        if (row.variantInformation) {
          let info = [];          
          row.variantInformation.forEach(item => {
            info.push(item.text.trim());            
          });          
          row.variantInformation = [{'text':info.join(' | '),'xpath':row.variantInformation[0].xpath}];
          row.variantCount = [{'text':info.length,'xpath':row.variantInformation[0].xpath}];
        }
        if (row.variants) {
          let info = [];          
          row.variants.forEach(item => {
            let j_data = JSON.parse(item.text);
            let sku = j_data["values"];
            sku = sku.replace(/(\s*sku\;\s*)+/isg, '').trim();
            info.push(sku.trim());            
          });            
          row.variants = [{'text':info.join(' | '),'xpath':row.variants[0].xpath}];          
        }
        if (row.firstVariant) {
            let info = [];          
            row.firstVariant.forEach(item => {
                let j_data = JSON.parse(item.text);
                let sku = j_data["values"];
                sku = sku.replace(/(\s*sku\;\s*)+/isg, '').trim();
                info.push(sku.trim());            
            });            
            row.firstVariant = [{'text':info.join(' | '),'xpath':row.firstVariant[0].xpath}];          
        }        
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };