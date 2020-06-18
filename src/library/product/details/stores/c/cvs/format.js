/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
    .replace(/[^\x00-\x7F]/g, '');
  
  for (const { group } of data) {
    for (let row of group) {
      try {
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
  return data;
};
module.exports = { transform };
