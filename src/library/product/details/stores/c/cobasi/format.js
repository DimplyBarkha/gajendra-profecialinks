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
        if (row.alternateImages) {
            row.alternateImages.forEach(item => {                    
                item.text = "https://www.cobasi.com.br" + item.text;
            });
        }
        if (row.listPrice) {
            row.listPrice.forEach(item => {                    
                item.text = item.text.replace(/[De: ]/g, '').trim();
            });
        }
        if (row.price) {
            row.price.forEach(item => {                    
                item.text = item.text.replace(/[Por: | à vista]/g, '').trim();
            });
        }
        if (row.retailerProductCode) {
            row.retailerProductCode.forEach(item => {                    
                item.text = item.text.replace("ts-js-shelf-", '').trim();
            });
        }
        if (row.proteinPerServingUom) {
            row.proteinPerServingUom.forEach(item => {                    
                item.text = item.text.substring(item.text.indexOf(' ')+1).trim();
            });
        }
        if (row.upc) {
            let upc_text = '';
            row.upc.forEach(item => {
                upc_text = item.text;
                upc_text = upc_text.substring( upc_text.lastIndexOf("productEans")+15, upc_text.lastIndexOf("skuStocks")-3 ).trim();
                item.text = upc_text.substring(0, upc_text.indexOf('"'));
            });
        }
      }
    }
    return cleanUp(data);
  };  
module.exports = { transform };