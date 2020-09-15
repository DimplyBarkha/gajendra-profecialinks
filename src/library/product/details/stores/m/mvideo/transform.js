/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.description) {
          row.description.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
          });
        }

        if (row.shippingInfo) {
          row.shippingInfo.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' ').trim();
          });
        }

        if (row.image) {
          row.image.forEach(item => {
            item.text = 'https:'+item.text;
          });
        }

        if (row.alternateImages) {
          var img_arr = [];
          row.alternateImages.forEach(item => {
            img_arr.push({"text":'https:'+item.text.replace(/small_pic\/65\//g, ''), "xpath": row.alternateImages[0]["xpath"]});
          });
          if (img_arr.length > 1){
            img_arr.splice(0,1);
            row.alternateImages = img_arr;
          }else{
            delete row.alternateImages;
          }
        }

        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = item.text.replace(/\D/g, '');
          });
        }

        if (row.sku) {
          row.sku.forEach(item => {
            item.text = item.text.replace(/.+-(\d+)/g, '$1');
          });
        }        

        if (row.category) {
          row.category.forEach(item => {
            item.text = item.text.replace('Главная', '').trim();
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' > ').trim();
          });
        }

        if(row.variantId){
          row.variantId.forEach(item => {
            item.text = item.text.replace(/.+-(\d+)/g, '$1');
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };