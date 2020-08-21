
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.image) {
        for (const item of row.image) {
          item.text = item.text.replace(/(.*)/, 'https://www.visions.ca$1');
        }
      }
      if (row.alternateImages) {
        for (const item of row.alternateImages) {
          item.text = item.text.replace(/(.*)/, 'https://www.visions.ca$1').replace(/_m_(\d)/, '_l_$1');
        }
      }
      // if (row.ratingCount) {
      //   for (const item of row.ratingCount) {
      //     item.text = item.text.replace(/([\d+]) .*/, '$1');
      //   }
      // }
      if (row.sku) {
        for (const item of row.sku) {
          item.text = item.text.replace(/.*&sku=(.*)/, '$1').trim();
        }
      }
      if (row.mpc && row.sku) {
        row.mpc = row.sku;
      }
      if (row.variantId && row.sku) {
        row.variantId = row.sku;
      }
      if (row.gtin) {
        for (const item of row.gtin) {
          const descJSON = (JSON.parse(item.text)) ? JSON.parse(item.text) : [];
          item.text = (descJSON && descJSON.gtin12) ? descJSON.gtin12.trim() : '';
        }
      }
      if (row.ratingCount) {
        for (const item of row.ratingCount) {
          const descJSON = (JSON.parse(item.text)) ? JSON.parse(item.text) : [];
          item.text = (descJSON && descJSON.aggregateRating && descJSON.aggregateRating.ratingCount) ? descJSON.aggregateRating.ratingCount.trim() : '';
        }
      }
      if (row.aggregateRating) {
        for (const item of row.aggregateRating) {
          const descJSON = (JSON.parse(item.text)) ? JSON.parse(item.text) : [];
          item.text = (descJSON && descJSON.aggregateRating && descJSON.aggregateRating.ratingValue) ? descJSON.aggregateRating.ratingValue.trim() : '';
        }
      }
      if (row.manufacturerImages) {
        for (const item of row.manufacturerImages) {
          item.text = 'https://www.visions.ca' + item.text;
        }
      }
      if (row.shippingDimensions) {
        const text = [];
        for (const item of row.shippingDimensions) {
          text.push(item.text.replace(/\n/gm, ' ').trim());
        }
        row.shippingDimensions = [{ text: text.join(' | ') }];
      }
      if (row.specifications) {
        const text = [];
        for (const item of row.specifications) {
          text.push(item.text.replace(/\n/gm, ' ').trim());
        }
        row.specifications = [{ text: text.join(' || ') }];
      }
      if (row.warranty) {
        const text = [];
        for (const item of row.warranty) {
          text.push(item.text.trim());
        }
        row.warranty = [{ text: text.join(' | ') }];
      }
      if (row.productOtherInformation) {
        const text = []; let count = 1;
        let value = '';
        for (const item of row.productOtherInformation) {
          if (count % 2 !== 0) {
            value = (item.text.replace(/\n/gm, '').trim() + ' : ');
          } else {
            value = value + item.text.replace(/\n/gm, '').trim();
            text.push(value);
          }
          count++;
        }
        row.productOtherInformation = [{ text: text.join(' | ') }];
      }
    }
  }
  return data;
};

module.exports = { transform };
