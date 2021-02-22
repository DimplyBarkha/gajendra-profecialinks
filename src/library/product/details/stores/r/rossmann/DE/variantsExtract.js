// const { transform } = require('./shared')
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (!row.variantUrl[0].text.includes('https://www.rossmann.de')) {
        row.variantUrl[0].text = `https://www.rossmann.de${row.variantUrl[0].text}`;
      }
    }
  }
  return data;
};

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'rossmann',
    transform,
    domain: 'rossmann.de',
    zipcode: '',
  },
};
