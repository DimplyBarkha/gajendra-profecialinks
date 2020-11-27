const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = cleanUp;

  const variantsArray = await context.evaluate(async () => {
    const variantsSelector = document.querySelectorAll('.multiSkuDimensionValues>div');
    const variants = variantsSelector;
    return variants;
  });

  if (variantsArray !== null) {
    for (let i = 0; i < variantsArray.length; i++) {
      if (variantsArray[i + 1] === null) {
        return await context.extract(productDetails, { transform });
      }
      await context.evaluate(() => {
        variantsArray[i].click();
      });
      await context.extract(productDetails, { transform });

      // wait for extraction
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    };

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'vikingdirect',
    transform: cleanUp,
    domain: 'vikingdirect.fr',
    zipcode: '',
  },
  implementation,
};
