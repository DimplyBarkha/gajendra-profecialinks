
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
          item.text = item.text.match(/\(([^)]+)\)/)[1].slice(1,-1);
          item.text = item.text.replace(/\n\s*\n\s*/g, '').slice();

      });
  }
     if (row.alternateImages) {
        row.alternateImages.forEach(item => {
              item.text = item.text.match(/\(([^)]+)\)/)[1].slice(1,-1);
            });
    }

    if (row.manufacturerDescription) {
      row.manufacturerDescription.forEach(item => {
            item.text = item.text.replace(/\s\n/g, '').slice();
          });
   }
   if (row.category) {
    row.category.forEach(item => {
          item.text = item.text.replace(/\n\s/g, ' > ').slice(21, -1);
        });
 }
 if (row.sku) {
  row.sku.forEach(item => {
        item.text = item.text.match(/[^#]*$/g);
        item.text = item.text.toString().slice(0,-3);
      });
}
if (row.variantId) {
  row.variantId.forEach(item => {
        item.text = item.text.match(/[^#]*$/g);
        item.text = item.text.toString().slice(0,-3);
      });
}
                 
      }
      
    }
    return data;
  };
  
  module.exports = { transform };
  