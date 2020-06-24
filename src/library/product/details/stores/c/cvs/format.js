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
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '');
  // const state = context.getState();
  // // let variantArray = state.variantArray || [];
  // let variantArray = []
  // for (const { group } of data) {
  //   for (let row of group) {
  //     // console.log(row.variants[0].text)
  //     if(!variantArray.includes(row.variants[0].text)) {
        
  //       variantArray.push(row.variants[0].text);
  //     }
  //   }
  // }
  // console.log(variantArray)
  for (const { group } of data) {
    for (let row of group) {
      try {
        // row.variants = [];
        // variantArray.forEach(variant => {
        //   row.variants.push({ text: variant})
        // })
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
        if (row.additionalDescBulletInfo) {
          let text = '';
          row.additionalDescBulletInfo.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ' ')}  `;
          });
          row.additionalDescBulletInfo = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
        if (row.productOtherInformation) {
          let text = '';
          row.productOtherInformation.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ' ')}  `;
          });
          row.productOtherInformation = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
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
