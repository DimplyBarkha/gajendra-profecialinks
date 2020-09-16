
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
    const currentSelector = '.pdp-description-tab-readmore';
    const result = await context.evaluate((currentSelector) => {
    return Boolean(document.querySelector(currentSelector));
    }, currentSelector);
    
    if (result) {
    await context.click('.pdp-description-tab-readmore');
    await context.waitForNavigation();
    }
    return await context.extract(productDetails, { transform });
    }
};
