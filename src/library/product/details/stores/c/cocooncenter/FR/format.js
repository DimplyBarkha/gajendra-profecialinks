
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

            if(row.listPrice) {
                row.listPrice[0].text = row.listPrice[0].text.replace(',','.');
            }

            if(row.price) {
                row.price[0].text = row.price[0].text.replace(',','.');
            }

            if(row.quantity) {
                row.quantity[0].text = row.quantity[0].text.replace(',','.');
            }

            if(row.specifications) {
                let result = '';
                let xpath = '';
                row.specifications.forEach(item => {
                    result += `${item.text} || `;
                    xpath = item.xpath;
                  });
                row.specifications = [{ text: result.slice(0, -4), xpath: xpath }];
            }

            if (row.sku) {
              let firstVariant = row.sku[0].text.split('-')[0];
              row.firstVariant = [{text: firstVariant, xpath: row.sku[0].xpath}];
            }
        }
      }
  
      data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        if (typeof el.text!=='undefined') {
            el.text = clean(el.text);
        }
      }))));
      return data;
    };
    
    module.exports = { transform };
    