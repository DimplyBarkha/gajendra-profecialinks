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
            if (row.sku) {
                row.sku.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['sku']){
                    if(data['sku']){
                      item.text = data['sku'];
                    }
                  }else{
                    item.text = "";
                  }           
                });
            } 

            if (row.variantId) {
                row.variantId.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['sku']){
                    if(data['sku']){
                      item.text = data['sku'];
                    }
                  }else{
                    item.text = "";
                  }           
                });
            }  
            if (row.category) {
                row.category.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['category']){
                    if(data['category']){
                      item.text = data['category'];
                    }
                  }else{
                    item.text = "";
                  }           
                });
            }  
            if (row.nameExtended) {
                row.nameExtended.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['name']){
                    if(data['name']){
                      item.text = data['name'];
                    }
                  }else{
                    item.text = "";
                  }           
                });
            }
            if (row.name) {
                row.name.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['name']){
                    if(data['name']){
                      item.text = data['name'];
                    }
                  }else{
                    item.text = "";
                  }           
                });
            }
            if (row.availabilityText) {
                row.availabilityText.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['offers']){
                    if(data['offers']['availability']){
                      item.text = data['offers']['availability'];
                      item.text = item.text.replace("https://schema.org/","");
                    }
                  }else{
                    item.text = "";
                  }           
                });
            }  
            if (row.brandText) {
                row.brandText.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['brand']){
                    if(data['brand']['name']){
                      item.text = data['brand']['name'];
                    }
                  }else{
                    item.text = "";
                  }       
                });
            }
            if (row.gtin) {
                row.gtin.forEach(item => {
                  let data = JSON.parse(item.text);
                  if(data['gtin']){
                    item.text = data['gtin'];
                  }else{
                    item.text = "";
                  }       
                });
            }
            if (row.price) {          
              row.price.forEach(item => {
                item.text = "€".concat(item.text);
              });      
            }
            if (row.listPrice) {          
              row.listPrice.forEach(item => {
                item.text = "€".concat(item.text);
              });      
            }
            if (row.description) {
              let info = [];
              row.description.forEach(item => {
                  info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
              });
              row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
            }
            if (row.descriptionBullets) {
              let info = [];
              row.descriptionBullets.forEach(item => {
                  info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
              });
              row.descriptionBullets = [{'text':info.join(' | '),'xpath':row.descriptionBullets[0].xpath}];
            }
            if (row.warnings) {
              let info = [];
              row.warnings.forEach(item => {
                  info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
              });
              row.warnings = [{'text':info.join(' | '),'xpath':row.warnings[0].xpath}];
            }
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };