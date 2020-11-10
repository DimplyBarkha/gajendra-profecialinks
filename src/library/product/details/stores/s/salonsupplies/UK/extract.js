const { transform } = require('../format.js');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('select option')) ? document.querySelectorAll('select option').length : 0;
  });
  if (variantLength > 1) {
    // await preparePageForCommonElement(0, variantLength);
    for (let j = 0; j < variantLength; j++) {
      await context.evaluate(async (j) => {
        return document.querySelectorAll('div.list-wrapper li')[j].click();
      }, j);
      // await context.click(`ul.topic li label`);
      console.log('Inside variants', j);
      // await preparePage(j, variantLength);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
    }
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'salonsupplies',
    transform: transform,
    domain: 'salonsupplies.co.uk',
    zipcode: "''",
  },
  implementation,
};
