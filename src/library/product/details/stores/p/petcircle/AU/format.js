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
      for (const row of group) {
        if (row.availabilityText){
            var strStock = ''
            if(row.availabilityText[0].text === 'false'){
                row.availabilityText = [{"text": 'In Stock', "xpath": row.availabilityText[0].xpath}]                 
            }else{
                row.availabilityText = [{"text": 'Out of Stock', "xpath": row.availabilityText[0].xpath}] 
            }
        }
        if (row.alternateImages){
            let arrSecImg = [];
            row.alternateImages.forEach(item => {
                arrSecImg.push(item.text)
            });
            if (arrSecImg.length) {
                row.alternateImages = [];
                arrSecImg.forEach(item => {
                    row.alternateImages.push({ "text": item });
                });
            }
        }
        if(row.listPrice){
            var strListPrice = row.listPrice[0].text
            strListPrice = strListPrice.replace(/Don't pay† /g, '')
            row.listPrice = [{"text": strListPrice, "xpath": row.listPrice[0].xpath}]
        }
        if(row.variants){
            var arrVariants = []
            var countVariant = 0
            if(row.variants.length>1){
                countVariant = row.variants.length
                row.variants.forEach(variant => {
                    arrVariants.push(variant.text)
                })
                row.variants     = [{"text": arrVariants.join(' | '), "xpath": row.variants[0].xpath}]
                row.variantCount = [{"text": countVariant, "xpath": row.variants[0].xpath}]
            }
        }
        if(row.additionalDescBulletInfo){
            var strLongDesc         = ''
            var strDescBulletCount  = 0
            strLongDesc             = row.additionalDescBulletInfo[0].text
            strDescBulletCount      = (strLongDesc.match(/<li>/ig) || []).length;
            strLongDesc = strLongDesc.replace(/<li>/ig, ' | ')
            strLongDesc = strLongDesc.replace(/(<([^>]+)>)/ig, '') 
            
            row.additionalDescBulletInfo = [{"text": strLongDesc, "xpath": row.additionalDescBulletInfo[0].xpath}]  
            row.descriptionBullets = [{"text": strDescBulletCount, "xpath": row.additionalDescBulletInfo[0].xpath}]  

        }
        if(row.variantInformation){
            var arrTemp = []  
            row.variantInformation.forEach(variantInfo => {
                arrTemp.push(variantInfo.text)
            })
            row.variantInformation = [{"text": arrTemp.join(' | '), "xpath": row.variantInformation[0].xpath}]
        }
        
      }
    }

    return cleanUp(data);
  };
  
  module.exports = { transform };