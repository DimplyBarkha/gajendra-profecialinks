
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').slice();
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/\n\s*\n\s*\n\s*\n\s*/g, '').slice();
          item.text = item.text.replace(/\n\s*\n\s*/g, '').slice();
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.match(/\(([^)]+)\)/)[1].slice(1, -1);
          item.text = item.text.replace(/\n\s*\n\s*/g, '').slice();
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.match(/\(([^)]+)\)/)[1].slice(1, -1);
          item.text = item.text.replace(/\/thumb\//, '\/full\/');
        });
        if(row.alternateImages.length > 1){
          row.alternateImages.splice(0,1);
        }else{
          delete row.alternateImages;
        }
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').slice();
        });
      }
      if (row.category) {
        let cat_arr = [];
        row.category.forEach(item => {
          cat_arr = item.text.split(/\s*\n\s*/);
        });
        if(cat_arr.length > 0){
          row.category = [];
          cat_arr.splice(0,1);
          cat_arr.forEach(item => {
            row.category.push({"text":item});
          });
        }else{
          delete row.category;
        }
      }
      if (row.sku) {
        row.sku.forEach(item => {
          item.text = item.text.match(/[^#]*$/g);
          item.text = item.text.toString().slice(0, -3);
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.match(/[^#]*$/g);
          item.text = item.text.toString().slice(0, -3);
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
