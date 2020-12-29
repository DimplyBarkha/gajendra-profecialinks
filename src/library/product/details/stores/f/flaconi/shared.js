
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
          if (item.text === '0') {
            item.text = '1';
          }
        });
      }
      // if (row.aggregateRating) {
      //   row.aggregateRating.forEach(item => {
      //     item.text = item.text.replace(',','.');
      //   });
      // }

      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace('/product/', '/original/');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('/product/', '/original/');
        });
      }
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/\s+/g, ' ').trim();
        });
      }
      if (row.variantUrl) {
        const length = row.variantUrl.length;
        const firstEle = row.variantUrl[length - 1].text;
        console.log('firstEle: ', firstEle);
        // row.variantUrl.forEach(item => {
        // // @ts-ignore
        // row.variantUrl = row.variantUrl+'#sku='+row.variantId[item].text;
        // });
      }
      if (row.variantId) {
        const length = row.variantId.length;
        const firstEle = row.variantId[length - 1].text;
        console.log('firstEle: ', firstEle);
        row.variantId.forEach(item => {
        // @ts-ignore
          item.text = firstEle;
        });
        if (row.sku) {
          row.sku.forEach(item => {
          // @ts-ignore
            item.text = firstEle;
          });
        }
        
        if (row.asin) {
          row.asin.forEach(item => {
            item.text = firstEle;
          });
        }
        
        if (row.gtin) {
          row.gtin.forEach(item => {
            item.text = firstEle;
          });
        }
      }
      if (row.category) {
        row.category.pop();
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = item.text.replace(/\n/g, '').trim();
        });
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
