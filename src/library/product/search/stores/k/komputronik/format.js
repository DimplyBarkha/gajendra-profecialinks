
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
              item.text = item.text.replace(/\|.*$/g, '').slice();
              item.text = item.text.replace(/\//g, '').slice(0, -2);
              item.text = parseInt(item.text);
          });
      }

      if (row.reviewCount) {
        row.reviewCount.forEach(item => {
            item.text = item.text.replace(/.+(\|)/g, '').slice();
            item.text = item.text.replace(/\s/g, '').slice(0,-6)
            item.text = parseInt(item.text);
        });
      }

      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
            item.text = item.text.replace(/\s\n/g, '').trim();
        });
      }   

      if (row.name) {
        row.name.forEach(item => {
            item.text = item.text.replace(/\s\n/g, '').trim();
        });
      }   

      if (row.price) {
        row.price.forEach(item => {
            item.text = item.text.replace(/\s\n/g, '').trim();
            item.text = item.text.replace(/\s*/g, '').trim();
        });
      }   
         
       if (row.variantId) {
            row.variantId.forEach(item => {
              item.text = item.text + "sj";
                item.text = item.text.slice(33,-1);
                item.text = item.text.match(/[^[\]]+(?=])/g);
                item.text = item.text.toString();
               
                
            });
        } 

        if (row.id) {
            row.id.forEach(item => {
              item.text = item.text + "sj";
                item.text = item.text.slice(33,-1);
                item.text = item.text.match(/[^[\]]+(?=])/g);
                item.text = item.text.toString();
               
                
            });
        }         
          
          
      }
      
    }
    return data;
  };
  
  module.exports = { transform };
  