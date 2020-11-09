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
          let brand = '';
          let variant_id = '';
          
          if (row.variantId) {
            row.variantId.forEach(item => {
              variant_id = item.text;
            });
          }
          if (row.image) {
            row.image.forEach(item => {
                item.text = "https:" + item.text;
            });
          }
          if (row.additionalDescBulletInfo) {            
            row.additionalDescBulletInfo.forEach(item => {
              item.text = "|" + item.text.replace(/(\s*\n\s*)+/g, ' | ').trim();            
            });
          }
          if (row.descriptionBullets) {
            row.descriptionBullets.forEach(item => {
               let info = item.text.split("\n");
               item.text = info.length;
              
            });
          }
          if (row.alternateImages) {
            row.alternateImages.forEach(item => {
                item.text = "https:" + item.text;
            });
          }
          if (row.brandText) {            
            row.brandText.forEach(item => {
                let data = JSON.parse(item.text);
                if(data['brand']){
                    item.text = data['brand'];
                    brand = item.text;
                }
                else{
                    delete row.brandText;
                }
            });
          }
          if (row.nameExtended) {            
            row.nameExtended.forEach(item => {
                if(brand != ''){
                    item.text = item.text + " - " + brand;
                }
            });
          }
          if (row.description) {
            let info = [];          
            row.description.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
            });
            row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
          }
          if (row.specifications){
            let info = [];          
            row.specifications.forEach(item => {              
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());
            });
            
            if (info.length>0){
              row.specifications = [{'text':info.join(' | '),'xpath':row.specifications[0].xpath}];            
            }
          }
          if (row.metaKeywords) {
            row.metaKeywords = [{'text':row.metaKeywords[0]['text'],'xpath':row.metaKeywords[0].xpath}];            
          }
          if (row.availabilityText) {            
            row.availabilityText.forEach(item => {
              if(item.text == 'Out of Stock'){
                delete row.quantity;
              }
              else{
                item.text = "In Stock";
              }
            });            
          }
          if (row.variantInformation){
            let info = [];          
            row.variantInformation.forEach(item => {              
              info.push(item.text.trim());
            });
            
            if (info.length>0){
              row.variantInformation = [{'text':info.join(' | '),'xpath':row.variantInformation[0].xpath}];            
            }
          }
          if (row.firstVariant) {            
            row.firstVariant.forEach(item => {
              if(item.text == '#'){
                item.text = variant_id;
              }
              else{
                var matches = /.+-p(\d+)/isg.exec(item.text);                
                if (matches){
                  item.text = matches[1];
                }
                else{
                  item.text = variant_id;
                }
              }
            });            
          }
          if (row.variants) { 
            let info = [];            
            row.variants.forEach(item => {
                var matches = /.+-p(\d+)/isg.exec(item.text);                
                if (matches){                  
                  info.push(matches[1]);
                }
                else if(item.text == '#'){
                  info.push(variant_id);
                }
            });
            row.variants = [{'text':info.join(' | '),'xpath':row.variants[0].xpath}];
          }
          if (row.variantCount) {
            row.variantCount = [{'text':row.variantCount.length,'xpath':row.variantCount[0].xpath}];
          }
        }
      }
      return cleanUp(data);
    };
    module.exports = { transform };