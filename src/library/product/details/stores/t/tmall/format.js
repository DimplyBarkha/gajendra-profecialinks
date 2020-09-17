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
      
      if(row.alternateImages){
        row.alternateImages.forEach(item => {
          item.text=item.text.replace("_50x50.jpg", "");
        });
      }
      if(row.sku){
        row.sku.forEach(item => {
          var skuArr=item.text.split("/item/");
          var skuArr1=skuArr[1].split(".");
          item.text=skuArr1[0];
        });
      }
      if(row.variantId){
        row.variantId.forEach(item => {
          var arr=item.text.split("/item/");
          var arr1=arr[1].split(".");
          item.text=arr1[0];
        });
      }      
      if(row.ratingCount){
        row.ratingCount.forEach(item => {
          var ratingCountArr=item.text.split(" ");
          item.text=ratingCountArr[0];
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
  