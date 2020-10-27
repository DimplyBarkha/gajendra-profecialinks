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
          var myRegexp = /.+-(.+)/g;
          var match = myRegexp.exec(item.text);
          if (match) {
            item.text = match[1].trim();
          }else{
            delete row.variantId;
          }
        });
      }
      if (row.variantUrl) {
        row.variantUrl.forEach(item => {
          item.text = "https://riverbendhome.com/products/" + item.text;
        });
      }
    }
  }
  return data;
};

module.exports = { transform };