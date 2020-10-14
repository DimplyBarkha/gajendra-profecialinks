/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const cleanUp = (data, context) => {
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
    for (const { group } of data) {
      for (let row of group) {
        if (row.sku) {
          row.sku.forEach(item => {
            item.text = item.text.replace(/(\s*)+/g, '').trim();
            item.text = item.text.replace('Item#', '').trim();
          });
        } 
        if (row.variantId) {
            row.variantId.forEach(item => {
              item.text = item.text.replace(/(\s*)+/g, '').trim();
              item.text = item.text.replace('Item#', '').trim();
            });
        }
        if (row.brandText) {
            row.brandText.forEach(item => {
              item.text = item.text.replace(/(\s*)+/g, '').trim();
              item.text = item.text.replace('All', '').trim();
            });
        }
        if (row.description) {
            let description_ar = [];
            row.description.forEach(item => {
              description_ar.push(item.text);
            });
            if (description_ar.length) {
              row.description = [{ "text": description_ar.join(" || ") }];
            }
        }
        if (row.category) {
            let info = [];
            row.category.forEach(item => {
                item.text = item.text.replace(/(\s*)+/g, '').trim();
                info.push(item.text);
            });
            row.category = [{ 'text': info.join(' > ').replace('Home > ', '').trim(), 'xpath': row.category[0].xpath }];
        }  
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };