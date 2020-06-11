/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
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
    }
  }
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    console.log('INSIDE OF CLEANUP');
    if(dataStr) {
      dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
        .replace(/&amp;nbsp;/g, ' ')
        .replace(/&amp;#160/g, ' ')
        .replace(/\\u00A0/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/"\s{1,}/g, '"')
        .replace(/\s{1,}"/g, '"')
        .replace(/^ +| +$|( )+/g, ' ')
        // eslint-disable-next-line no-control-regex
        .replace(/[^\x00-\x7F]/g, '');

      return JSON.parse(dataStr);
    } else {
      return data
    }
  };

  return cleanUp(data);
};
module.exports = { transform };
