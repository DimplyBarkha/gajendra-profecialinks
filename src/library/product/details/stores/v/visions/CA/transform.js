
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
      if (row.price) {
        for (const item of row.price) {
          item.text = item.text.replace(/,/, '');
        }
      }
      if (row.listPrice) {
        for (const item of row.listPrice) {
          item.text = item.text.replace(/,/, '');
        }
      }
      // if (row.ratingCount) {
      //   for (const item of row.ratingCount) {
      //     item.text = item.text.replace(/([\d+]) .*/, '$1');
      //   }
      // }
      if (row.sku) {
        for (const item of row.sku) {
          item.text = decodeURIComponent(item.text) ? decodeURIComponent(item.text).replace(/.*&sku=(.*)/, '$1') : item.text.replace(/.*&sku=(.*)/, '$1');
        }
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
      if (row.mpc) {
        for (const item of row.mpc) {
          const descJSON = (JSON.parse(item.text)) ? JSON.parse(item.text) : [];
          item.text = (descJSON && descJSON.mpn) ? descJSON.mpn.trim() : '';
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
      if (row.availabilityText) {
        for (const item of row.availabilityText) {
          if (item.text.toLowerCase().includes('add to cart')) {
            item.text = 'In Stock';
          }
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
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = { transform };
