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
          if (row.variantCount && row.variantCount[0]["text"] != "0") {            
            row.variantCount = [{'text':row.variantCount.length,'xpath':row.variantCount[0].xpath}];          
          }
          
          if (row.variantInformation) {
            let info = [];          
            row.variantInformation.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());            
            });
            row.variantInformation = [{'text':info.join(' | '),'xpath':row.variantInformation[0].xpath}];          
          }
          if (row.variants) {
            let info = [];          
            row.variants.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());            
            });
            row.variants = [{'text':info.join(' | '),'xpath':row.variants[0].xpath}];          
          }

          if (row.description) {
            let info = [];          
            row.description.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());            
            });
            row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];          
          }
          if(row.descriptionBullets){            
            row.descriptionBullets = [{'text':row.descriptionBullets.length, 'xpath':row.descriptionBullets[0].xpath}];
          }
          if (row.sku) {            
            row.sku.forEach(item => {
              try {
                let json_data = JSON.parse(item.text);                
                if (json_data.length>0 && json_data[0]['sku']){
                  item.text = json_data[0]['sku'];
                }
                else{
                  delete row.sku;
                  return false;
                }
              } catch (error) {
                delete row.sku;
                return false;
              }
            });
          }
          if (row.mpc) {            
            row.mpc.forEach(item => {
              try {
                let json_data = JSON.parse(item.text);                
                if (json_data.length>0 && json_data[0]['mpn']){
                  item.text = json_data[0]['mpn'];
                }
                else{
                  delete row.mpc;
                  return false;
                }
              } catch (error) {
                delete row.mpc;
                return false;
              }
            });
          }
          if (row.aggregateRating) {
            row.aggregateRating.forEach(item => {
              item.text = (parseInt(item.text) * 5) / 100;            
            });
          }          
          /*if (row.brandText) {            
            row.brandText.forEach(item => {
              item.text = item.text.replace(/(\s*\'\s*)+/g, '"');
              var matches = /dataLayer\s*=\s*(\[.+\]);/isg.exec(item.text);              
              
              if (matches){                
                try {
                  let json_data = JSON.parse(matches[1]);                  
                  if (json_data.length > 0){
                    if (json_data[0]["ecommerce"]["detail"]["products"] && json_data[0]["ecommerce"]["detail"]["products"].length > 0){
                      if (json_data[0]["ecommerce"]["detail"]["products"][0]["brand"]){
                        item.text = json_data[0]["ecommerce"]["detail"]["products"][0]["brand"];
                      }
                    }
                  }
                } catch (error) {                  
                  delete row.brandText;
                  return false;
                }
              }
              else{
                delete row.brandText;
                return false;
              }
            });
          }*/
                
        }
      }
      return cleanUp(data);
    };
    
    module.exports = { transform };