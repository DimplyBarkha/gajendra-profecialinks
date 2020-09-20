
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
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
        });
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
        });
      }
      if (row.weightNet) {
        row.weightNet.forEach(item => {
          item.text = item.text.replace(/(\s*Weight\s*:\s*)+/g, '').trim();
        });
      }
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
        });
      }
      if (row.descriptionBullets) {
        row.descriptionBullets.forEach(item => {
          let dec = item.text.replace(/(\s*\n\s*)+/g, ' > ').trim();
          let bul = dec.split('>');
          item.text = bul.length;
        });
      }
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
        });
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          item.text = 'In Stock'
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
