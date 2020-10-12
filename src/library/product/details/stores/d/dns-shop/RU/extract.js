
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    transform: null,
    domain: 'dns-shop.ru',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const { id } = inputs;

    try {
      await context.setInputValue('.ui-input-search__input', id);
      // await context.waitForSelector('.product-images-slider');
    } catch (e) {
      console.log('Details page not found');
    }

    return await context.extract(productDetails, { transform });
  },
};
