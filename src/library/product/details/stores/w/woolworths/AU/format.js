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
        if (row.name){
            var strJSONString   = ''
            strJSONString       = row.name[0].text 
            var obj             = JSON.parse(strJSONString);
            
            if(obj.hasOwnProperty('offers')){
                var strPrice = ''
                strPrice     = '$' + obj.offers.price //+ obj.offers.priceCurrency
                row.price    = [{"text": strPrice, "xpath": row.name[0].xpath}]
            }
            if(obj.hasOwnProperty('image')){
                var strImg  = ''
                strImg      = obj.image
                row.image   = [{"text": strImg, "xpath": row.name[0].xpath}]
            }
            if(obj.hasOwnProperty('brand')){
                var strBrand    = ''
                strBrand        = obj.brand.name
                row.brandText   = [{"text": strBrand, "xpath": row.name[0].xpath}]
            }
            if(obj.hasOwnProperty('gtin13')){
                var strGtin     = ''
                strGtin         = obj.gtin13
                row.gtin        = [{"text": strGtin, "xpath": row.name[0].xpath}]
            }
            if(obj.hasOwnProperty('sku')){
                var strSku      = ''
                strSku          = obj.sku
                row.sku         = [{"text": strSku, "xpath": row.name[0].xpath}]
                row.variantId   = [{"text": strSku, "xpath": row.name[0].xpath}]
            }
            if(obj.hasOwnProperty('name')){
                var strPrdName  = ''
                var strExtName  = ''
                strPrdName      = obj.name
                strExtName      = strPrdName
                row.name        = [{"text": strPrdName, "xpath": row.name[0].xpath}]
                row.nameExtended= [{"text": strExtName, "xpath": row.name[0].xpath}]
            }
        }

        if (row.alternateImages){
            var tmpAltImagesCount = 0
            row.alternateImages.forEach(img => {
                tmpAltImagesCount++
                img.text = img.text.replace('\/medium\/', '/large/')
            })
            row.secondaryImageTotal= [{"text": tmpAltImagesCount}]
        }
        if (row.listPrice){
            var tmpAltImages
            row.listPrice.forEach(price => {
                price.text = price.text.replace(/Was /g, '')
            })
        }
        
        if (row.availabilityText){
            row.availabilityText.forEach(item => {
                if(item.text.trim() === 'Unavailable'){
                    item.text = 'Out Of Stock'
                }else{
                    item.text = 'In Stock'
                }
            })
        }
        if(row.proteinPerServing){
            //console.log(row.proteinPerServing)
            var tmpTable = []
            tmpTable = row.proteinPerServing[0].text.split(/[\r\n]+/)
            for(var i = 0; i<tmpTable.length; i++){
                switch(tmpTable[i]) {
                    case 'Protein':
                        row.proteinPerServing = [{"text": tmpTable[i+1].trim(), "xpath": row.proteinPerServing[0].xpath}]
                        row.proteinPerServingUom = [{"text": tmpTable[i+2].trim(), "xpath": row.proteinPerServing[0].xpath}]
                        break;
                    case 'Fat, total':
                        row.totalFatPerServing = [{"text": tmpTable[i+1].trim(), "xpath": row.proteinPerServing[0].xpath}]
                        row.totalFatPerServingUom = [{"text": tmpTable[i+2].trim(), "xpath": row.proteinPerServing[0].xpath}]
                        break;
                    case '– saturated':
                        row.saturatedFatPerServing = [{"text": tmpTable[i+1].trim(), "xpath": row.proteinPerServing[0].xpath}]
                        row.saturatedFatPerServingUom = [{"text": tmpTable[i+2].trim(), "xpath": row.proteinPerServing[0].xpath}]
                        break;
                    case 'Carbohydrate':
                        row.totalCarbPerServing = [{"text": tmpTable[i+1].trim(), "xpath": row.proteinPerServing[0].xpath}]
                        row.totalCarbPerServingUom = [{"text": tmpTable[i+2].trim(), "xpath": row.proteinPerServing[0].xpath}]
                        break;
                    case '– sugars':
                        row.totalSugarsPerServing = [{"text": tmpTable[i+1].trim(), "xpath": row.proteinPerServing[0].xpath}]
                        row.totalSugarsPerServingUom = [{"text": tmpTable[i+2].trim(), "xpath": row.proteinPerServing[0].xpath}]
                        break;
                    case 'Sodium':
                        row.sodiumPerServing = [{"text": tmpTable[i+1].trim(), "xpath": row.proteinPerServing[0].xpath}]
                        row.sodiumPerServingUom = [{"text": tmpTable[i+2].trim(), "xpath": row.proteinPerServing[0].xpath}]
                        break;
                    default:
                        // code block
                }
            }
        }
      }
    }

    return cleanUp(data);
  };
  
  module.exports = { transform };