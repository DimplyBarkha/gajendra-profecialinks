
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
      for (const row of group) {
        if (row.color) {
          row.color.forEach(item => {
            var myRegexp = /Farbe\s*:\s*(.+)/g;
            var match = myRegexp.exec(item.text);
            if (match) {
              if (match.length) {
                item.text = match[1].trim();
              } else {
                item.text = "";
              }
            }
          });
        }
        if (row.name) {
          row.name.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' ').trim();
          });
        }      
        if (row.nameExtended) {
          row.nameExtended.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' ').trim();
          });
        }
        if (row.price) {
          row.price.forEach(item => {
            item.text = item.text.replace('RSD', ' ').trim();
            item.text = item.text.replace(' ', '').trim();
            item.text = item.text.replace(',', '').trim();
            item.text = item.text.replace('.', '').trim();
          });
        }
        if (row.listPrice) {
          row.listPrice.forEach(item => {
            item.text = item.text.replace('RSD', ' ').trim();
            item.text = item.text.replace(' ', '').trim();
            item.text = item.text.replace(',', '').trim();
            item.text = item.text.replace('.', '').trim();
          });
        }
        if (row.productPrice) {
            row.productPrice.forEach(item => {
              item.text = item.text.replace('RSD', ' ').trim();
              item.text = item.text.replace(' ', '').trim();
              item.text = item.text.replace(',', '').trim();
              item.text = item.text.replace('.', '').trim();
            });
          }
          if (row.totalPriceInCart) {
            row.totalPriceInCart.forEach(item => {
              item.text = item.text.replace('RSD', ' ').trim();
              item.text = item.text.replace(' ', '').trim();
              item.text = item.text.replace(',', '').trim();
            });
          }
          if (row.sku) {
            row.sku.forEach(item => {
              item.text = item.text.replace('ID', ' ').trim();
              item.text = item.text.replace(':', '').trim();
              item.text = item.text.replace('', '').trim();
              item.text = item.text.replace('ИД','').trim();
            });
          }
        if (row.gtin) {
          row.gtin.forEach(item => {
            var myRegexp = /ean\"\s*:\s*\"(.+?)\"/g;
            var match = myRegexp.exec(item.text);
            if (match) {
              if (match.length) {
                item.text = match[1].trim();
              } else {
                item.text = "";
              }
            }
          });
        }
        if (row.description) {
          row.description.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
          });
          row.description[0].text = '||' + row.description[0].text
        }
        if (row.brandLink) {
          row.brandLink.forEach(item => {
            item.text = 'https://www.maxi.rs' + item.text
          });
        }
      
        if (row.category) {
          let info = [];
          row.category.forEach(item => {
            info.push(item.text.trim());
          });
          if (info.length) {
            row.category = [];
            info.forEach(item => {
              row.category.push({ "text": item });
            });
          }
        }
        if (row.alternateImages) {
          let info = [];
          row.alternateImages.forEach(item => {
            info.push('https://www.maxi.rs' + item.text)
          });
          if (info.length) {
            row.alternateImages = [];
            info.forEach(item => {
              row.alternateImages.push({ "text": item });
            });
          }
        }
        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
            item.text = 'https://www.maxi.rs' + item.text
          });
        }
        if (row.image) {
          row.image.forEach(item => {
            item.text = 'https://www.maxi.rs' + item.text
          });
        }
        if (row.warranty) {
          row.warranty.forEach(item => {
            item.text = item.text.replace(/Garantie/ig, ' ').trim();
          });
        }
        if (row.variants) {
          let info = [];
          row.variants.forEach(item => {
            info.push(item.text.replace(/(.+\/)/g, '').trim());
          });
          row.variants = [{ 'text': info.join(' | '), 'xpath': row.variants[0].xpath }];
        }
        if(row.variantCount){
          var tot=0;
          row.variantCount.forEach(item => {
            tot++;
          });
          if(tot==1){
            tot = 0;
            row.variants = [{'text':''}]
            row.firstVariant = [{'text':''}]
            row.variantInformation = [{'text':''}]          
          }
          row.variantCount=[{text:tot}];
        }
        if(row.variantInformation){
          var arr_info=[];
          row.variantInformation.forEach(item => {          
            arr_info.push(item.text)
          });
          row.variantInformation=[{text:arr_info.join(' | ')}];
        }
        if (row.specifications) {
          row.specifications.forEach(item => {
            item.text = item.text.replace(/\n\s*\n\s*\n\s*/g, ' || ').trim();
            item.text = item.text.replace(/\n\s*/g, ':').trim();
          });
        }
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = parseInt(item.text);
          });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {          
            item.text = item.text.replace('.', ',').trim();
          });
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };
  