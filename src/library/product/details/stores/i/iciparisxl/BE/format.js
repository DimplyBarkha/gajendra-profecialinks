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
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text =  Number(item.text);
        });
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
      if (row.reviewCount) {
          row.reviewCount.forEach(item => {
            var tmp = item.text.replace('(', '');
            item.text = tmp.replace(')', '');
            item.text=parseInt(item.text);
          });
      }
      if (row.image) {
          row.image.forEach(item => {
            item.text = 'https://www.iciparisxl.be'+item.text;
          });
      }
      if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            item.text = 'https://www.iciparisxl.be'+item.text;
          });
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
      if(row.availabilityText){
        row.availabilityText.forEach(item => {
          if (item.text === 'Niet meer voorradig'){
            row.availabilityText = [{"text": 'Out of Stock', "xpath": row.availabilityText[0].xpath}]
          }
        })
      }
      if(row.pricePerUnit){
        var strUnit = ''
        var strunitPrice =''
         row.pricePerUnit.forEach(item => {
           strUnit      = item.text.match(/(?<=\/)(.*?)(?=\:)/g)
           strunitPrice = item.text.match(/\b\d[\d,.]*\b/g)
           strunitPrice = strunitPrice.toString().split(',')[0]
         })
         row.pricePerUnit     = [{"text": strunitPrice, "xpath": row.pricePerUnit[0].xpath}]
         row.pricePerUnitUom  = [{"text": strUnit, "xpath": row.pricePerUnit[0].xpath}]
      }
      if(row.variantInformation){
        var strVariantInfo = ''
        row.variantInformation.forEach(item => {
          strVariantInfo = strVariantInfo + item.text + ' | '
        })
         row.variantInformation = [{"text": strVariantInfo, "xpath": row.variantInformation[0].xpath}]
      }     
      
    }
  }
  return cleanUp(data);
};
module.exports = { transform };