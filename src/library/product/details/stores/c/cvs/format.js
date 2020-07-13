/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // const cleanUp = (data, context) => {
  //   data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
  //     el.text = clean(el.text);
  //   }))));
  //   return data;
  // };
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '');


  for (const { group } of data) {
    for (let row of group) {
      try {
        if (row.variants) {
          if(row.variants.length < 2){

            row.variants = [{ text: '' }];
          }
        }

        if (row.variantInformation) {
          let variantsArray = [];
          if(row.variantInformation.length > 1){
            row.variantInformation.forEach(variant => {
              variantsArray.push(variant.text)
            })
            let variantString = variantsArray.join(" || ")
            row.variantInformation = [{ text: variantString }];
          }
        }

        if (row.firstVariant || row.variantId) {
          let text = row.firstVariant[0].text;
          let split = text.split('-')
          row.variantId = [{ text: `${split[split.length - 1]}` }];
          row.firstVariant = [{ text: `${split[split.length - 1]}` }];
        }

        if (row.sku) {
          row.productUrl = [{ text: `${row.productUrl[0].text}?skuid=${row.sku[0].text}` }];
        }
        if (row.manufacturerDescription) {
          let text = '';
          row.manufacturerDescription.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ' ')}  `;
          });
          row.manufacturerDescription = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
        // if (row.additionalDescBulletInfo) {
        //   let text = '';
        //   row.additionalDescBulletInfo.forEach(item => {
        //     text += `${item.text.replace(/\n \n/g, ' ')}  `;
        //   });
        //   row.additionalDescBulletInfo = [
        //     {
        //       text: text.slice(0, -4),
        //     },
        //   ];
        // }
        if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0].text.length > 1) {
          row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
        }
        // if (row.productOtherInformation) {
        //   let text = '';
        //   row.productOtherInformation.forEach(item => {
        //     text += `${item.text.replace(/\n \n/g, ' ')}  `;
        //   });
        //   row.productOtherInformation = [
        //     {
        //       text: text.slice(0, -4),
        //     },
        //   ];
        // }
        // row = cleanUp(row);
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  // context.setState({ variantArray });
  return data;
};
module.exports = { transform };
