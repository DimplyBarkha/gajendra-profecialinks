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
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text =  Number(item.text);
          });
        }
        if (row.reviewCount) {
            row.reviewCount.forEach(item => {
              item.text =  Number(item.text);
            });
        }
        if (row.aggregateRating) {
            row.aggregateRating.forEach(item => {
              item.text =  Number(item.text);
            });
        }
        if (row.price) {
            row.price.forEach(item => {
                item.text = item.text.replace(/\s*/g, '').trim();
                item.text = item.text.replace('.', '.').trim();
                item.text = "CHF"+item.text;
            });
        }
        if (row.image) {
          let info = [];
          row.image.forEach(item => {
              item.text = item.text.replace(/\?.*/, '');
              info.push(item.text);
          });
          if (info.length) {
            row.image = [{ "text": info, 'xpath': row.image[0].xpath }];
          }
       }
       if(row.availabilityText){
        row.availabilityText.forEach(item => {
          if (item.text == 'out of stock'){
            row.availabilityText = [{"text": 'Out of Stock', "xpath": row.availabilityText[0].xpath}]
          }else{
            row.availabilityText = [{"text": 'In Stock', "xpath": row.availabilityText[0].xpath}]
          }
        })
      }
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
              item.text = item.text.replace(/,.*/, '');
              item.text = item.text.replace('1x', '');
              item.text = 'I'+ item.text;
              item.text = item.text.slice(1, -1);
              item.text = item.text.replace(/\?.*/, '');
          });
          if (row.alternateImages) {
            row.alternateImages.shift();
          }
       }
       if (row.secondaryImageTotal) {
        row.secondaryImageTotal.forEach(item => {
            item.text = item.text.replace(/,.*/, '');
            item.text = item.text.replace('1x', '');
            item.text = 'I'+ item.text;
            item.text = item.text.slice(1, -1);
            item.text = item.text.replace(/\?.*/, '');
        });
        if (row.secondaryImageTotal) {
          row.secondaryImageTotal.shift();
        }
        if (row.secondaryImageTotal) {
          row.secondaryImageTotal = [{'text':row.secondaryImageTotal.length}];              
        } 
     }
        if (row.description) {
            let description_ar = [];
            row.description.forEach(item => {
              description_ar.push(item.text);
            });
            if (description_ar.length) {
              row.description = [{ "text": description_ar.join("siva").replace(/siva.*/, ''), 'xpath': row.description[0].xpath }];
            }
        }
        if (row.nameExtended) {
          let info = [];
          row.nameExtended.forEach(item => {
            info.push(item.text);
          });
          if (info.length) {
            row.nameExtended = [{ "text": info.join(" "), 'xpath': row.nameExtended[0].xpath }];
          }
      }
        if(row.variants){
        
          let value = []
          //console.log('Hey there')
          for (let index = 0; index < row.variants.length; ++index) {
            value.push(row.variants[index].text);
            //console.log(index, value);
          }
          row.variants = [{"text": value.join(' | '), "xpath": row.variants[0].xpath}]
        }
        if(row.variantInformation){
          var strVariantInfo = ''
          row.variantInformation.forEach(item => {
            strVariantInfo = strVariantInfo + item.text + ' | '
          })
           row.variantInformation = [{"text": strVariantInfo, "xpath": row.variantInformation[0].xpath}]
        }       
        if (row.specifications) {
            var rowItem = ''
            var rowCounter = 1
            row.specifications.forEach(item => {
              if((rowCounter % 2)){
                rowItem = rowItem +  item.text 
              } else{
                rowItem = rowItem +  item.text + ' || '
              }
              rowCounter = rowCounter + 1
            });
            row.specifications = [{'text':rowItem, 'xpath': row.specifications[0].xpath}]
            //console.log(row.specifications)
        }
        if (row.descriptionBullets) {
          row.descriptionBullets = [{'text':row.descriptionBullets.length, 'xpath':row.descriptionBullets[0].xpath}];              
        } 
        
        if (row.category) {
          let info = [];
          row.category.forEach(item => {
            info.push(item.text.trim());
          });
          if (info.length) {
            row.category = [];
            info.forEach(item => {
              row.category.push({ "text": item});
            });
          }
        }
      }
    }
    return cleanUp(data);
  };
module.exports = { transform };