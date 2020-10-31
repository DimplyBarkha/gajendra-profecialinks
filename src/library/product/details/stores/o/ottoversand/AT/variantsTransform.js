/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // Default transform function
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

  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.variantId) {
          var siteURL = '';
          var artNo = '';

          if (typeof row.productUrl[0].text !== 'undefined') {
            siteURL = row.productUrl[0].text;
          }

          if (typeof row.sku[0].text !== 'undefined') {
            if (row.sku[0].text.indexOf('Art.-Nr.:') !== -1) {
              artNo = row.sku[0].text.replace('Art.-Nr.: ', '');
            }
          }
          row.variantId.forEach(item => {
            if (siteURL !== '' && artNo !== '') {
              item.text = siteURL + '#sku=' + artNo + '-' + item.text;
            } else {
              item.text = '';
            }
          });
        }

        if (row.variantUrl) {
         
          if (typeof row.productUrl[0].text !== 'undefined') {
            siteURL = row.productUrl[0].text;
          }

          if (typeof row.sku[0].text !=== 'undefined') {
            if (row.sku[0].text.indexOf('Art.-Nr.:') !== -1) {
              artNo = row.sku[0].text.replace('Art.-Nr.: ', '');
            }
          }
          row.variantUrl.forEach(item => {
            if (siteURL !== '' && artNo !== '') {
              item.text = siteURL + '#sku=' + artNo + '-' + item.text;
            } else {
              item.text = '';
            }
          });
        }

        if (row.sku) {
          let newText = '';
          row.sku.forEach(item => {
            newText = item.text.replace('Art.-Nr.: ', '');
          });
          row.sku = [{ text: newText }];
        }
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
