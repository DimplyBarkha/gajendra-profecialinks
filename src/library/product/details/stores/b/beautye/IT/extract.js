const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 20000));
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('div.swatch-attribute-options div.swatch-option')) ? document.querySelectorAll('div.swatch-attribute-options div.swatch-option').length : 0;
  });
  console.log("variantLength:: ", variantLength);
  if (variantLength > 1) {
    for (let j = 0; j < variantLength; j++) {
      try {
        try {
          await context.evaluate(async (j) => {
            const variantDoc = document.querySelectorAll('div.swatch-option')[j].click();
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            return variantDoc;
          }, j);
          console.log('Inside variants', j);
        } catch (err) {}
        if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
      } catch (err) {}
    }
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'beautye',
    transform: transform,
    domain: 'beautye.it',
    zipcode: "''",
  },
  implementation,
};
