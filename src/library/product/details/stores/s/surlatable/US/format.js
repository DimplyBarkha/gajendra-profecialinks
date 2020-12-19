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
  
            if (row.aggregateRating) {
                row.aggregateRating.forEach(item => {
                    item.text = item.text.split('-')[1]
                });
            }
            
            if (row.ratingCount) {
              row.ratingCount.forEach(item => {
                item.text = item.text.split(" ")[0]
              });
            }

            if (row.brandText) {
              row.brandText.forEach(item => {
                item.text = item.text.split(":")[1]
              });
            }

            if (row.manufacturer) {
              row.manufacturer.forEach(item => {
                item.text = item.text.split(":")[1]
              });
            }

            if (row.ingredientsList) {
              row.ingredientsList.forEach(item => {
                item.text = item.text.split(":")[1]
              });
            }

            if (row.weightNet) {
              row.weightNet.forEach(item => {
                item.text = item.text.split(":")[1]
              });
            }

            if (row.shippingDimensions) {
              row.shippingDimensions.forEach(item => {
                item.text = item.text.split(":")[1].split(';')[0];
              });
            }

            if (row.warranty) {
              row.warranty.forEach(item => {
                item.text = item.text.split(":")[1]
              });
            }

            if (row.sku && row.mpc) {
                row.sku[0].text = row.sku[0].text.replace('PRO-','');
                row.variantId = row.sku;
                let xpath = row.mpc[0].xpath;
                let json = JSON.parse("[" + row.mpc[0].text + "]");
                json.forEach(ele => {
                    if(ele.sku == row.sku[0].text) {
                        row.mpc = [{text: ele.mpn, xpath: xpath}];                        
                        row.color = [{text: ele.color, xpath: xpath}];
                        row.imageAlt = [{text: ele.name, xpath: xpath}];
                    }
                });
                row.firstVariant = [{text: json[0].sku, xpath: xpath}];
                row.variantCount = [{text: json.length, xpath: xpath}];
            }

            if (row.specifications) {
                let result = '';
                let xpath = row.specifications[0].xpath;
                row.specifications.forEach(item => {
                    result += `${item.text} || `;
                  });
                row.specifications = [{ text: result.slice(0, -4), xpath: xpath }];
            }
        } 
    }
  
      data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }))));
      return data;
    };
    
    module.exports = { transform };
  