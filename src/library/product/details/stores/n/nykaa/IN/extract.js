
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    transform: null,
    domain: 'nykaa.com',
    zipcode: '',
  },
  implementation: async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
    ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const currentSelector = '#cnet-accordion';
    const result = await context.evaluate((currentSelector) => {
    return Boolean(document.querySelector(currentSelector));
    }, currentSelector);
    
    if (result) {
    await context.click('#cnet-accordion');
    await context.waitForFunction(() => {
    return !document.querySelector('[aria-label="Loading interface..."]');
    });
    }
    return await context.extract(productDetails, { transform });
    }
};
