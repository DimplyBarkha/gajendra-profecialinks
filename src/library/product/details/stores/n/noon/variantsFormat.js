/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      // if (row.variantUrl) {
      //   row.variantUrl.forEach(item => {
      //     var variant_id = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
      //     item.text = 'https://www.noon.com/saudi-en/' + variant_id + '/p';
      //   });
      // }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
