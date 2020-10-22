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
          
          /*if (row.alternateImages) {
            let info = [];          
            row.alternateImages.forEach(item => {
              item.text = item.text.replace(/(\/wc\d+\/)+/g, '\/wc1200\/');
            });          
          }*/
          
          if (row.reviewCount) {
            row.reviewCount.forEach(item => {
              item.text = item.text.trim();
            });
          }
          if (row.description) {
            let info = [];          
            row.description.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());            
            });
            row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];          
          }
          if (row.availabilityText) {          
            row.availabilityText.forEach(item => {
              item.text = 'In Stock'
            });
          }        
  
          if (row.ratingCount) {
            row.ratingCount.forEach(item => {
              let data = JSON.parse(item.text);
              if(data['aggregateRating']){
                if(data['aggregateRating']['reviewCount']){
                  item.text = data['aggregateRating']['reviewCount'];
                }
              }
            });
          }
          if (row.aggregateRating) {
            row.aggregateRating.forEach(item => {
              let data = JSON.parse(item.text);
              if(data['aggregateRating']){
                if(data['aggregateRating']['ratingValue']){
                  item.text = data['aggregateRating']['ratingValue'];
                  item.text = item.text.replace(/(\.)+/g, ',').trim();
                }
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
  
          if (row.image) {
            row.image.forEach(item => {
              let data = JSON.parse(item.text);
              if(data['coverImage']){
                item.text = data['coverImage'].trim();
              }else{
                delete row.image;
              }
            });
          }
  
          if (row.alternateImages) {
            row.alternateImages.forEach(item => {            
              let data = JSON.parse(item.text);            
              let info = []
              if(data['images'] && data['images'].length>1){
                data['images'].shift();              
                if (data['images'][0]['src']){                
                  data['images'].forEach(img_data => {
                    info.push({'text':img_data['src'],'xpath':row.alternateImages[0].xpath});            
                  });
                }
                else if(data['images'].length > 0){
                  data['images'].forEach(img_data => {                  
                    info.push({'text':img_data,'xpath':row.alternateImages[0].xpath});            
                  });
                }
                row.alternateImages = info;
              }else{
                delete row.alternateImages;
              }
            });
          }
  
          if (row.sku) {
            row.sku.forEach(item => {
              item.text = item.text.replace(/(\s*Код\s*товара\s*:\s*)+/g, '').trim();
            });
          }
  
          if (row.variantId) {
            row.variantId.forEach(item => {
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
          if(row.additionalDescBulletInfo){
            let arr_info = [];
            row.additionalDescBulletInfo.forEach(item=>{
              arr_info.push(item.text);
            });
            row.descriptionBullets = [{'text':arr_info.length}];
            row.additionalDescBulletInfo = [{'text':'| '+arr_info.join(' | ')}];
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
                        if (variation['variants'] != null) {
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
                            if (variation['type'] == 'apparelPics' || variation['type'] == 'colors'|| variation['type'] == 'sizes')  {
                              variant_info.push(variants_data['data']['textRs'][0]['content']);
                            }
                          });
                        }
                      });
                  }
                  
              });
              
              if(variations.length){
                  //row.variantId = data['sku'];
                  row.variantCount = [{"text": variations.length, "xpath": row.variants[0]["xpath"]}];
                  row.variantInformation = [{"text": variant_info.join(' | '), "xpath": row.variants[0]["xpath"]}];
                  row.variants = [{"text": variations.join(' | '), "xpath": row.variants[0]["xpath"]}];
                  row.firstVariant = [{'text':row.variantId[0].text}];
              }else{
                  delete row.variants;
              }          
          }
          
                 
        }
      }
      return cleanUp(data);
    };
    
    module.exports = { transform };