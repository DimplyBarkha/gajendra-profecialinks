/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
        if (row.productUrl) {
          var text = '';
         text = 'https://www.myer.com.au'+row.productUrl[0].text;
         console.log(text)
          row.productUrl = [
            {
              text: text,
            },
          ];
        }

        if (row.description) {
          let text = '';
          row.description.forEach(item => {
            text += item.text+"||";
          });
          text = text.substring(0,text.length-2);
          row.description = [
            {
              text: text,
            },
          ];
        }

        if (row.additionalDescBulletInfo) {
          let text = '';
          row.additionalDescBulletInfo.forEach(item => {
            text += item.text+"||";
          });
          text = text.substring(0,text.length-2);
          row.additionalDescBulletInfo = [
            {
              text: text,
            },
          ];
        }
       
          if (row.weightNet) {
            let text = '';
            row.weightNet.forEach(item => {
              text += item.text.replace('Product weight: ','').trim();
            });
            row.weightNet = [
              {
                text: text,
              },
            ];
          }
          if (row.weightGross) {
            let text = '';
            row.weightGross.forEach(item => {
              text += item.text.replace('Box weight: ','').trim();
            });
            row.weightGross = [
              {
                text: text,
              },
            ];
          }
          if (row.shippingWeight) {
            let text = '';
            row.shippingWeight.forEach(item => {
              text += item.text.replace('Box weight: ','').trim();
            });
            row.shippingWeight = [
              {
                text: text,
              },
            ];
          }
          if (row.shippingDimensions) {
            let text = '';
            row.shippingDimensions.forEach(item => {
              text += item.text.replace('Box dimensions (mm):','').trim();
            });
            row.shippingDimensions = [
              {
                text: text,
              },
            ];
          }                
      }
    }
  return data;
};

module.exports = { transform };
