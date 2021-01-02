
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
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s*\n\s*\n\s*\n\s*/g, ' || ').trim();
          item.text = item.text.replace(/\n\s*\n\s*/g, ' : ').trim();
        });
      }

      if (row.category) {
        var categoryArr = [];
        row.category.forEach(item => {
          var category = item.text.replace(/\s*\n\s*\n\s*/g, '').trim();
          categoryArr = category.split(' >');
          categoryArr.splice(0, 1);
          categoryArr.splice(categoryArr.length - 1, 1);
        });
        if (categoryArr.length) {
          row.category = [];
          categoryArr.forEach(item => {
            row.category.push({ text: item });
          });
        }
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/cart\./g, 'zoom-desktop.').trim();
        });
      }
      if (row.unInterruptedPDP) {
        var arrTemp = [];
        row.unInterruptedPDP.forEach(item => {
          arrTemp.push(item.text);
        });
        if (arrTemp.length) {
          row.unInterruptedPDP = [{ text: arrTemp.join(' || ') }];
        }
      }
      if (row.inTheBoxText) {
        var temp = '';
        //console.log(row.inTheBoxText)
          row.inTheBoxText.forEach(item => {
            
              if(item.text.indexOf(':')>0){
                console.log('If: ' + item.text)
                temp = item.text.split(':')[1]
                temp = temp.split('.')[0]
                item.text = temp.replace(/,/g,' || ')
              }else{
                console.log('else: ' + item.text)

                temp = item.text.split('.')[0]
                item.text = temp.replace(/,/g,' || ')
              }
            })
          }
      // if (row.inTheBoxText) {
      //   row.inTheBoxText.forEach(item => {
      //     item.text = item.text.replace(/,/g,' || ')
      //   })
      // }
      
      if (row.variants) {
        const variations = [];
        const vInfo = [];
        let color = null;
        row.variants.forEach(item => {
          const data = JSON.parse(item.text);
          if (data.variations) {
            data.variations.forEach(variation => {
              variations.push(variation.sku);
              vInfo.push(variation.color);
              if (variation.sku === row.sku[0].text) {
                row.firstVariant = [{ text: variation.sku }];
              }
            });
          }
          color = data.attributes.color;
        });
        if (color) {
          row.color = [{ text: color }];
        }
        if (variations.length) {
          row.variantCount = [{ text: variations.length }];
          row.variants = [{ text: variations.join(' | ') }];
        } else {
          delete row.variants;
          row.variantCount = [{ text: 0 }];
        }
      }
      if (row.color && row.quantity) {
        row.variantInformation = [{ text: row.color[0].text + ' ' + row.quantity[0].text }];
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
