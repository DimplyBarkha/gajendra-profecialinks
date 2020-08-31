
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
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

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text += `${item.text.replace(/\n/g, '')}`;
        });
        row.directions = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.name) {
        let text = '';
        row.name.forEach(item => {
          text += `${item.text.trim()} `;
        });
        row.name = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace('See All', '')} | `;
        });
        row.description = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variantCount) {
        row.variantCount.forEach(variantCount => {
          if (variantCount.text === '0') {
            variantCount.text = '1';
          }
        });
      }
      if (row.nameExtended) {
        let text = '';
        row.nameExtended.forEach(item => {
          text += `${item.text.trim()} `;
        });
        row.nameExtended = [
          {
            text: cleanUp(text),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
