/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variantId) {
        row.variantId.forEach(item => {
          var myRegexp = /products\/(.+?)-/g;
          var match = myRegexp.exec(item.text);
          if (match) {
            item.text = match[1].trim();
          }
        });
      }
      if (row.variantUrl) {
        row.variantUrl.forEach(item => {
          item.text = "https://www.staples.ca" + item.text;
        });
        var myRegexp = /.+-(.+?-.+?-.+)/g;
        var match = myRegexp.exec(row.variantUrl[0]["text"]);
        if (match) {
          row.variant = [{ "text": match[1].trim() }];
        }
      }
    }
  }
  return data;
};

module.exports = { transform };