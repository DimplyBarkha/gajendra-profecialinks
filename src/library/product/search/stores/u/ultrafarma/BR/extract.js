const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const mainUrl = await context.evaluate(async function () {
    return document.URL;
  });
  console.log(mainUrl, 'MainURL');
  await new Promise((resolve, reject) => setTimeout(resolve, 30000));
  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'ultrafarma',
    transform: transform,
    domain: 'ultrafarma.com.br',
    zipcode: "''",
  },
  implementation,
};
