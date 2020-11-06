/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    const clean = text => text.toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;|&nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      .trim()
    // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    for (const { group } of data) {
      for (const row of group) {
        if (row.countryOfOrigin) {
          if (row.countryOfOrigin[0].text.match(/Made in the/)) {
            row.countryOfOrigin = [
              {
                text: row.countryOfOrigin[0].text.replace(/Made in the\s*/, ''),
              },
            ];
          }
        }
        if (row.allergyAdvice) {
          const text = row.allergyAdvice.map(elm => elm.text).join(' ');
          row.allergyAdvice = [
            {
              text,
            },
          ];
        }
        if (row.promotion) {
          const text = row.promotion.map(elm => elm.text).join('|');
          row.promotion = [
            {
              text,
            },
          ];
        }
        if (row.ingredientsList && row.ingredientsList.length) {
          const text = row.ingredientsList[0].text.match(/^.+?(?=<br><br>)/) ? row.ingredientsList[0].text.match(/^.+?(?=<br><br>)/)[0] : row.ingredientsList[0].text;
          const list = clean(text.replace(/<[^>]+>/g, ' ')).split(/,+(?![^(]*\))/g).map(elm => ({ text: elm }));
          row.ingredientsList = list;
        }
  
        if (row.specifications) {
          const text = row.specifications.map(elm => elm.text).join(' ');
          row.specifications = [
            {
              text,
            },
          ];
        }

        // if (row.pricePerUnitUom) {
        //     row.pricePerUnitUom.forEach(item => {
        //         item.text = item.text.substr(item.text.indexOf('r')+2)
        //     });
        // }
    
        // if (row.pricePerUnit) {
        //     row.pricePerUnit.forEach(item => {
        //         item.text = item.text.substr(item.text.indexOf('|')+2)
        //         item.text = item.text.substr(0,item.text.indexOf('p')-1)
        //     });
        // }
    
        if (row.quantity) {
            row.quantity.forEach(item => {
                item.text = item.text.substr(0,item.text.indexOf('|')-1)
            });
        }
    
        if (row.listPrice) {
            row.listPrice.forEach(item => {
                item.text = item.text.substr(item.text.indexOf(' ')+1)
            });
        }
  
        if (row.alternateImages) {
          const baseUrl = row.alternateImages[0].text.match(/url\("([^?]+)/)[1];
          row.alternateImages = row.alternateImages.slice(1).map((elm, index) => {
            elm.text = `${baseUrl}_${index + 1}?wid=1920&hei=1080&op_sharpen=1`;
            return { text: elm.text };
          });
        }
  
        row.secondaryImageTotal = [
          {
            text: (row.alternateImages && row.alternateImages.length) || '0',
            type: 'NUMBER',
            value: (row.alternateImages && row.alternateImages.length) || 0,
          },
        ];
        if (row.color) {
          const text = row.nameExtended[0].text + ' - ' + row.color[0].text;
          row.nameExtended = [
            {
              text,
            },
          ];
        }
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      }
    }
    return data;
  };
  module.exports = { transform };
  