/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {

      if (row.variantUrl) {
        row.variantUrl.forEach(item => {
          item.text = "https://www.casasbahia.com.br" + item.text;
        });
      }
      if (row.variant) {
        row.variant.forEach(item => {
          var myRegexp = /(.+?)\|/g;
          var match = myRegexp.exec(item.text);
          if (match) {
            item.text = match[1];
          }
        });
      }
    }
  }
  return data;
};

module.exports = { transform };