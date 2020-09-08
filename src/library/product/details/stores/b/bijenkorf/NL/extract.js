const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.click('button.dbk-accordion__header');
  await context.waitForSelector('div.dbk-accordion__body');
  await context.evaluate(async () => {
    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    transform,
    domain: 'debijenkorf.nl',
    zipcode: '',
  },
  implementation,
};
