// @ts-nocheck

const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.specifications) {
          let text = '';
          row.specifications.forEach((item, index) => {
            if (index % 2 === 0) {
              text += item.text.trim() + ' : ';
            } else {
              text += item.text.trim() + ' || ';
            }
          });
          row.specifications = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
        if (row.availabilityText) {
          let newText = 'Out of Stock';
          row.availabilityText.forEach(item => {
            if (item.text.includes('vip-instock')) {
              newText = 'In Stock';
            }
          });
          row.availabilityText = [{ text: newText }];
        }
        if (row.countryOfOrigin) {
          row.countryOfOrigin.forEach(item => {
                  item.text = item.text.split(' ')[0].trim();
          });
        }
        if (row.alternateImages) {
          row.alternateImages.shift();
        }
        // if (row.variantId) {
        //   row.variantId.forEach(item => {
        //       item.text = item.text.split('/').reverse()[2].split('-').reverse()[0]
        //   });
        // }
        // if (row.description) {
        //   let text = '';
        //   row.description.forEach(item => {
        //     text = '||' + row.description.map(elm => elm.text).join(' ||');
        //   });
        //   row.description = [{ text }];
        // }
        if (row.variantId) {
          row.variantId.forEach(item => {
              let arr = item.text.split('-');
              let length = arr ? arr.length : 0;
              item.text = arr[length-1].replace(/\/i\//,'');
          });
        }
        if (row.variants) {
          row.variants.forEach(item => {
              let arr = item.text.split('-');
              let length = arr ? arr.length : 0;
              item.text = arr[length-1].replace(/\/i\//,'');
          });
          const unique = [...new Set(row.variants.map(item => item.text))]
          row.variants = [
            {
              text: unique.join(' | '),
            },
          ];
          row.variantCount = [
            {
              text: unique.length,
            },
          ];
        }
        if (row.firstVariant) {
          row.firstVariant.forEach(item => {
              let arr = item.text.split('-');
              let length = arr ? arr.length : 0;
              item.text = arr[length-1].replace(/\/i\//,'');
          });
        }
        if (row.shippingInfo) {
          row.shippingInfo.forEach(item => {
              item.text = item.text.replace(/(.*)\s\((.*)\)/,'$1');
          });
        }
        if(row.name){
          let brandName = '';
          row.name.forEach(item => {
            brandName = item.text.split(' ')[0];
          })
          if (row.brandText) {
            row.brandText.forEach(item => {
              if(item.text.includes('__NO_VALUE__')){
                 item.text = brandName;
              }else{
                item.text = item.text;
              }       
            });
          }
        }
        
        // if (row.variantId) {
        //   row.variantId.forEach(item => {
        //       item.text = item.text.replace(/\"item\_id\"\:(.*)\,\"offer\_id/g, '$1');
        //   });
        // }
      }
    }
  
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
  