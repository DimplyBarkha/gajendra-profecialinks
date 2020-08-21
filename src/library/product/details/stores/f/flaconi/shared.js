
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
            item.text = item.text.replace(/\n/g, '').trim();
          });
        }
        if (row.directions) {
          row.directions.forEach(item => {
            item.text = item.text.replace(/\n/g, '').trim();
          });
        }
        if (row.manufacturerDescription) {
          row.manufacturerDescription.forEach(item => {
            item.text = item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim();
          });
        }
        // if (row.aggregateRating) {
        //   row.aggregateRating.forEach(item => {
        //     item.text = item.text.replace(',','.');
        //   });
        // }

        if (row.image) {
          row.image.forEach(item => {
            item.text = item.text.replace('/product/','/original/');
          });
        }
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            item.text = item.text.replace('/product/','/original/');
          });
        }
        if (row.price) {
          row.price.forEach(item => {
            item.text = item.text.replace(',','').replace('.',',');
          });
        } 
        if (row.listPrice) {
          row.listPrice.forEach(item => {
            item.text = item.text.replace(',','').replace('.',',');
          });
        }
        if (row.shippingInfo) {
          row.shippingInfo.forEach(item => {
            item.text = item.text.replace(/\s+/g, " ").trim();
          });
        }
        if (row.variantUrl) {
          let length = row.variantUrl.length;
          let firstEle = row.variantUrl[length -1].text;
          console.log('firstEle: ', firstEle);
          // row.variantUrl.forEach(item => {
          // // @ts-ignore
          // row.variantUrl = row.variantUrl+'#sku='+row.variantId[item].text;
          // });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  