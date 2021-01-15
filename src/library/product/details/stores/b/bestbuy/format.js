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
                item.text = 'AHORRA ' + item.text;
            });
        }
        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
              item.text = item.text.replace(/,.*/, '');
              item.text = item.text.replace('200w', '');
              item.text = 'I'+ item.text;
              item.text = item.text.slice(1, -1);
          });
        }
        if (row.videos) {            
            row.videos.forEach(item => {
                item.text = item.text.replace(/(\s*img.youtube\s*)+/isg, 'youtube').trim();
                item.text = item.text.replace(/(\s*\/vi\/\s*)+/isg, '/watch?v=').trim();
                item.text = item.text.replace(/(\s*\/mqdefault.jpg\s*)+/isg, '').trim();
                item.text = item.text+'&feature=youtu.be'
            });
        }
        if (row.galleryVideos) {            
          row.galleryVideos.forEach(item => {
              item.text = item.text.replace(/(\s*img.youtube\s*)+/isg, 'youtube').trim();
              item.text = item.text.replace(/(\s*\/vi\/\s*)+/isg, '/watch?v=').trim();
              item.text = item.text.replace(/(\s*\/mqdefault.jpg\s*)+/isg, '').trim();
              item.text = item.text+'&feature=youtu.be'
          });
        }
        if(row.availabilityText){
          row.availabilityText.forEach(item => {
            if (item.text == 'Agotado'){
              row.availabilityText = [{"text": 'Out of Stock', "xpath": row.availabilityText[0].xpath}]
            }else{
              row.availabilityText = [{"text": 'In Stock', "xpath": row.availabilityText[0].xpath}]
            }
          })
        }
        if (row.description) {
          let description_ar = [];
          row.description.forEach(item => {
              description_ar.push(item.text);
          });
          if (description_ar.length) {
            row.description = [{ "text": description_ar, 'xpath': row.description[0].xpath }];
          }
        }
        if (row.ratingCount) {            
            row.ratingCount.forEach(item => {
                item.text = item.text.replace(/(\s*\(|\)\s*)+/isg, '').trim();
            });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
            item.text = item.text.replace('.', ',').trim();
          });
        }
        if (row.nameExtended) {
          row.nameExtended.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, '').trim();
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
        
        if (row.manufacturerImages) {    
          row.manufacturerImages.forEach(item => {
            item.text = 'https:' + item.text        
          });        
        }

        if (row.manufacturerDescription) {
          let info = [];
          row.manufacturerDescription.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, '  ').trim());
          });
          row.manufacturerDescription = [{'text':info.join(' '),'xpath':row.manufacturerDescription[0].xpath}];
      }

      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };