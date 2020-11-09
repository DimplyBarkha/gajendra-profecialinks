/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variants) {
        var scriptJSON = JSON.parse(row.variants[0].text);
        if (scriptJSON.productVariants) {
          var objectsInVariants = Object.keys(scriptJSON.productVariants).length;
          var varientIds = [];
          for (var i = 0; i < objectsInVariants; i++) {
            var keyName = Object.keys(scriptJSON.productVariants)[i];
            var variants = scriptJSON.productVariants[keyName].variants;
            variants.forEach(function (item, index) {
              varientIds.push(item.fupid);
            });
          }
        }
        row.variants = [{ text: varientIds.join(' | ') }];
      }
    }
  }
  return data;
};

module.exports = { transform };