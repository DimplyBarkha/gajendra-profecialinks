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
          
          if (row.metaKeywords) {
            row.metaKeywords = [{'text':row.metaKeywords[0]['text'],'xpath':row.metaKeywords[0].xpath}];            
          }
          
          if (row.variantId) {
            row.variantId.forEach(item => {                            
              var matches = /.*pr_page_id=(.*)/isg.exec(item.text);              
              if (matches){
                item.text = matches[1].trim();
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
          
          if (row.specifications) {
            let info = [];          
            row.specifications.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
            });          
            row.specifications = [{'text':info.join(' || '),'xpath':row.specifications[0].xpath}];          
          }
          if (row.variants) {
              let variations = [];
              let variant_info = [];              
              row.variants.forEach(item => {  
                
                item.text = item.text.replace(/(\s*window.__PRELOADED_STATE__\s*=\s*)+/isg, '');
                item.text = item.text.replace(/(\;)$/s, '');
                let data = JSON.parse(item.text);
                if(data['product']['product']['SKUs']){
                  data['product']['product']['SKUs'].forEach(variation => {
                    if (variation['partNumber']) {
                      variations.push(variation['partNumber']);
                    }                    
                  });
                }
                if(data['product']['product']['definingAttributes']){
                  data['product']['product']['definingAttributes'].forEach(variation => {                    
                    if (variation['values']){
                      variation['values'].forEach(variants_data => {                        
                        if (variants_data['values']){                          
                          variant_info.push(variants_data['values']);
                        }                        
                      });
                    }
                  });
                }
              });
              
              if(variations.length){
                  row.variantCount = [{"text": variations.length, "xpath": row.variants[0]["xpath"]}];
                  row.variantInformation = [{"text": variant_info.join(' | '), "xpath": row.variants[0]["xpath"]}];
                  row.variants = [{"text": variations.join(' | '), "xpath": row.variants[0]["xpath"]}];
                  row.firstVariant = [{'text':variations[0]}];
              }else{
                  delete row.variants;
              }              
          }
          
                 
        }
      }
      return cleanUp(data);      
    };
    
    module.exports = { transform };