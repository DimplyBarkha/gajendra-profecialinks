/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    var rankIndex = 1;
    for (const row of group) {
      if (row.brandText && row.brandText.length) {
        let str = row.brandText[0].text;
        str = str.substr(str.lastIndexOf('/') + 1);
        row.brandText[0].text = str.length ? str.split('-')[0] : 'Brand Not Found';
      }
      if (row.price && row.price.length) {
        let str = row.price[0].text;
        str = str.replace('٫', ',').replace('٬', ',').replace('.', ',');
        row.price[0].text = str;
      }
      if (row.rank) {
        row.rank[0].text = rankIndex;
      }
      rankIndex++;
    }
  }
  return data;
};

module.exports = { transform };