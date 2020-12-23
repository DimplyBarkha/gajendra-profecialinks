const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  const nextLinkSelector = await context.evaluate(() => {
    return document.querySelector('span.d-xs-inline.d-l-none');
  });

  if (nextLinkSelector !== null) {
    do {
      if (await context.evaluate(() => {
        return document.querySelector('span.d-xs-inline.d-l-none');
      }) === null) {
        return await context.extract(productDetails, { transform });
      } else {
        await context.extract(productDetails, { transform });

        await new Promise((resolve) => setTimeout(resolve, 3000));

        await context.evaluate(() => {
          document.querySelector('span.d-xs-inline.d-l-none').click();
        });
      }
    } while (true);
  } else {
    return await context.extract(productDetails, { transform });
  }
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    transform,
    domain: 'jumbo.com',
    zipcode: '',
  },
  implementation,
};
