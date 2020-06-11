/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    function cleanUp (data) {
      let dataStr = JSON.stringify(data);
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
    }
    const regexp = '(?:([\\d\\.]+)\\s?(\\w+))';
    function getSplitValue (inputStr, count) {
      if (inputStr) {
        const result = inputStr.match(regexp);
        return result[count];
      }
    }
    for (const { group } of data) {
        for (const row of group) {
          if (row.asin) {
            row.asin = [
              {
                text: row.asin[0].text.replace(/.+\/dp\//g,'').trim()
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
                text: text.slice(0, -4),
              },
            ];
          }
        }
      }
    return cleanUp(data);
  };
  
  module.exports = { transform };
  