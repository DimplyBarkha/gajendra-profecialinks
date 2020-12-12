const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    // @ts-ignore
    document.querySelector('div.features-wrapper a').click();
  });
  await new Promise(resolve => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'HU',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.hu',
    zipcode: "''",
  },
  implementation
};
