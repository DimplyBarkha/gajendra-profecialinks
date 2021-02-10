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
        if (row.availabilityText) {                    
          row.availabilityText.forEach(item => {
            if(item.text == "Manufacturer is currently out of stock."){
              item.text = "Out of stock";
            }else if(item.text == "Sorry! This item is not available."){
              item.text = "Out of stock";
            }else{
              item.text = "In stock";
            }
          });
        }
        if (row.specifications) {
          let info = [];
          row.specifications.forEach(item => {
              info.push(item.text);
          });
          row.specifications = [{'text':info.join(' | '),'xpath':row.specifications[0].xpath}];
        }
        if (row.sku) {
          row.sku.forEach(item => {
            let skuVal=item.text.replace('var digitalData = ', '');
            skuVal=skuVal.slice(0, skuVal.indexOf(';'));
            let data = JSON.parse(skuVal);
            console.log("skudata: ", data);
            if(data.eCommerce.hasOwnProperty('productInfo')){
              item.text=data.eCommerce.productInfo[0].productSKU;
            }else{
              item.text="";
            }
          });
        }
      }
    }
    return cleanUp(data);
  };
module.exports = { transform };