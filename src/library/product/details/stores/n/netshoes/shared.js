
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    console.log('INSIDE OF CLEANUP');
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
  };
  for (const { group } of data) {
    for (let row of group) {
      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          text += `${item.text.replace(/\./, ',')}`;
        });
        row.aggregateRating = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        let finalDesc = '';
        for (let i = 0; i < row.description.length; i++) {
          if (row.description[i].xpath.includes('p')) {
            finalDesc = finalDesc + row.description[i].text + ' || ';
          } else {
            finalDesc = finalDesc + row.description[i].text + ' ';
          }
        }
        if (finalDesc.trim().endsWith('||')) {
          finalDesc = finalDesc.trim().substring(0, finalDesc.length-2);
        }
        row.description = [
          {
            text: finalDesc.trim(),
          },
        ];
      }
      row = cleanUp(row);
    }
  }
  return data;
};

module.exports = { transform };
