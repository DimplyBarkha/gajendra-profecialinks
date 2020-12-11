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
        if (row.image) {
            row.image.forEach(item => {
                item.text = "https:" + item.text;
            });
        }
        if (row.alternateImages) {
            row.alternateImages.forEach(item => {
                item.text = "https:" + item.text;
            });
        }
        if (row.brandLink) {
            row.brandLink.forEach(item => {
                item.text = "https://www.wildberries.ru" + item.text;
            });
        }
        if (row.specifications) {
            let info = [];
            row.specifications.forEach(item => {
                info.push(item.text.trim());
            });
            row.specifications = [{'text':info.join(' | '),'xpath':row.specifications[0].xpath}];
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
        if (row.descriptionBullets) {
            row.descriptionBullets = [{'text':row.descriptionBullets.length, 'xpath':row.descriptionBullets[0].xpath}];              
        } 
        if (row.availabilityText) {                    
            row.availabilityText.forEach(item => {
              item.text = "In Stock";
            });          
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };