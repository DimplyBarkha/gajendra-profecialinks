
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      let text = '';
      if (row.availabilityJson) {
        let inStore = false;
        let deliver = false;
        const availabilityData = JSON.parse(row.availabilityJson[0].text.replace(/\\/g, ''));
        if (availabilityData &&
      availabilityData.data &&
      availabilityData.data.product &&
      availabilityData.data.product.fulfillment) {
          if (!availabilityData.data.product.fulfillment.is_out_of_stock_in_all_store_locations) {
            inStore = true;
          }

          if (availabilityData.data.product.fulfillment.store_options &&
            availabilityData.data.product.fulfillment.store_options.length) {
            availabilityData.data.product.fulfillment.store_options.forEach(store => {
              if (store.in_store_only.availability_status === 'IN_STOCK' || store.in_store_only.availability_status.includes('LIMITED_STOCK')) {
                inStore = true;
              }
            });
          }

          if (availabilityData.data.product.fulfillment.shipping_options &&
            (availabilityData.data.product.fulfillment.shipping_options.availability_status === 'IN_STOCK' || availabilityData.data.product.fulfillment.shipping_options.availability_status.includes('LIMITED_STOCK'))) {
            deliver = true;
          }
        }

        if (deliver) {
          text = 'In Stock';
        } else if (inStore) {
          text = 'In Stock';
        } else {
          text = 'Out of Stock';
        }
      } else {
        text = 'Out of Stock';
      }
      row.availabilityText = [{ text }];

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text = text + (text ? ' || ' : '') + item.text;
          text = text.replace('<B>', '').replace('</B>', '');
        });
        row.specifications = [{ text }];
      }
    }
  }

  // Clean up data
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

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
