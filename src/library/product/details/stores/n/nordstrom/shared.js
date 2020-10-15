
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.size) {
        let text = '';
        row.size.forEach(item => {
          text += item.text.replace(/\n/g, ' ');
        });
        row.size = [
          {
            text: text,
          },
        ];
      }

      if (row.nameExtended) {
        let text = '';
        row.nameExtended.forEach(item => {
          text = row.nameExtended.map(elm => elm.text).reverse().join(' - ');
        });
        row.nameExtended = [
          {
            text: text,
          },
        ];
      }
      if (row.promotion) {
        let text = '';
        row.promotion.forEach(item => {
          text = row.promotion.map(elm => elm.text).join(' - ');
        });
        row.promotion = [
          {
            text: text,
          },
        ];
      }

      if (row.price) {
        let text = '';
        row.price.forEach(item => {
          text = row.price.map(elm => elm.text).join('.');
        });
        row.price = [
          {
            text: text,
          },
        ];
      }


      if (row.quantity) {
        let text = '';
        row.quantity.forEach(item => {
          text = row.quantity.map(elm => elm.text).join(' | ').replace(/,/g,' | ');
        });
        row.quantity = [
          {
            text: text,
          },
        ];
      }

      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text = row.variantInformation.map(elm => elm.text).join(' | ').replace(/,/g,' | ');
        });
        row.variantInformation = [
          {
            text: text,
          },
        ];
      } 

      if (row.firstVariant) {
        let text = '';
        row.firstVariant.forEach(item => {
          text = row.firstVariant.map(elm => elm.text).join(' | ').replace(/,/g,' | ');
        });
        row.firstVariant = [
          {
            text: text,
          },
        ];
      } 
      
      let text = '';
      text = [String(row.nameExtended && row.nameExtended[0].text), String(row.firstVariant && row.firstVariant[0].text), String(row.quantity && row.quantity[0].text)].filter(e => e !== 'undefined').join(' - ');
      row.productDescriptionIm = [
        {
          text: text,
        },
      ];
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
