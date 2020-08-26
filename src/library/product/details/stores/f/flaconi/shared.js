
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
        if (row.variantCount) {
          row.variantCount.forEach(item => {
            if(item.text === '0'){
              item.text = '1';
            }
          });
        }
        // if (row.aggregateRating) {
        //   row.aggregateRating.forEach(item => {
        //     item.text = item.text.replace(',','.');
        //   });
        // }

        // if (row.image) {
        //   row.image.forEach(item => {
        //     item.text = item.text.replace('/product/','/original/');
        //   });
        // }
        // if (row.alternateImages) {
        //   row.alternateImages.forEach(item => {
        //     item.text = item.text.replace('/product/','/original/');
        //   });
        // }
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
        if (row.category) {
          row.category.pop();
        }
        if (row.nameExtended) {
          row.nameExtended.forEach(item => {
            item.text = item.text.replace(/\n/g, "").trim();
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  