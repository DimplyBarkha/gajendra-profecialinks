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
      try {
        if (row.availabilityText) {
          const availabilityTextArr = row.availabilityText.map((item) => {
            return (typeof (item.text) === 'string') && (item.text.includes('en stock')) ? 'In Stock' : 'Out of Stock';
          });
          row.availabilityText = [{ text: availabilityTextArr.join(), xpath: row.availabilityText[0].xpath }];
        }
        if (row.alternateImages) {
          row.alternateImages.shift();
          const countStr = row.alternateImages.length.toString;
          row.secondaryImageTotal = [{ text: countStr, xpath: row.ingredientsList[0].xpath }];
        }
        if (row.nameExtended && row.brandText) {
          row.nameExtended = [{ text: row.brandText[0].text + ' ' + row.nameExtended[0].text, xpath: row.nameExtended[0].xpath }];
        }
        row = cleanUp(row);
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  return data;
};
module.exports = { transform };
