
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        
        if (row.alternateImages) {
          let info = [];          
          row.alternateImages.forEach(item => {
            info.push(item.text.replace(/(\/wc\d+\/)+/g, '\/wc1200\/'));            
          });          
          row.alternateImages = [{'text':info.join(' | '),'xpath':row.alternateImages[0].xpath}];          
        }
        if (row.imageAlt) {
          let info = [];          
          row.imageAlt.forEach(item => {
            info.push(item.text.trim());            
          });          
          row.imageAlt = [{'text':info.join(' | '),'xpath':row.imageAlt[0].xpath}];          
        }
        if (row.reviewCount) {
          row.reviewCount.forEach(item => {
            item.text = item.text.trim();
          });
        }

        if (row.category) {
          row.category.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' > ').trim();
          });
        }

        if (row.description) {
          row.description.forEach(item => {
            let data = JSON.parse(item.text);
            if(data['description']){
              item.text = data['description'].replace(/(\s*\n\s*)+/g, ' || ').trim();
            }else{
              item.text = '';
            }
          });
        }

        if (row.soldBy) {
          row.soldBy.forEach(item => {
            let data = JSON.parse(item.text);
            if(data['name']){
              item.text = data['name'].trim();
            }else{
              item.text = '';
            }
          });
        }

        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
            let data = JSON.parse(item.text);
            if(data['coverImage']){
              item.text = data['coverImage'].trim();
            }else{
              item.text = '';
            }
          });
        }

        if (row.sku) {
          row.sku.forEach(item => {
            item.text = item.text.replace(/(\s*Код\s*товара\s*:\s*)+/g, '').trim();
          });
        }

        

        if (row.shippingInfo) {
          let info = [];          
          row.shippingInfo.forEach(item => {
            info.push(item.text);            
          });          
          row.shippingInfo = [{'text':info.join(' | '),'xpath':row.shippingInfo[0].xpath}];          
        }

        if (row.specifications) {
          let info = [];          
          row.specifications.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
          });          
          row.specifications = [{'text':info.join(' || '),'xpath':row.specifications[0].xpath}];          
        }

        if (row.productOtherInformation) {
          let info = [];          
          row.productOtherInformation.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
          });          
          row.productOtherInformation = [{'text':info.join(' || '),'xpath':row.productOtherInformation[0].xpath}];          
        }

        if (row.variants) {
            let variations = [];
            let variant_info = [];
            row.variants.forEach(item => {
                let data = JSON.parse(item.text);
                if(data['aspects']){                    
                    data['aspects'].forEach(variation => {                      
                      variation['variants'].forEach(variants_data => {
                        var link_data = variants_data['link'];
                        var matches = /.+\/(\d+)\//isg.exec(link_data);
                        var matches1 = /.+-(\d+)\//isg.exec(link_data);
                        if (matches){
                          link_data = matches[1];
                        }
                        else if(matches1){
                          link_data = matches1[1];
                        }                        
                        if (!variations.includes(link_data)) {
                          variations.push(link_data);
                        }
                        if (variation['type'] == 'apparelPics' || variation['type'] == 'colors')  {
                          variant_info.push(variants_data['data']['textRs'][0]['content']);
                        }
                      });
                    });
                }
                
            });
            
            if(variations.length){
                //row.variantId = data['sku'];
                row.variantCount = [{"text": variations.length, "xpath": row.variants[0]["xpath"]}];
                row.variantInformation = [{"text": variant_info.join(' | '), "xpath": row.variants[0]["xpath"]}];
                row.variants = [{"text": variations.join(' | '), "xpath": row.variants[0]["xpath"]}];
            }else{
                delete row.variants;
            }          
        }
               
      }
    }
    return data;
  };
  
  module.exports = { transform };
  