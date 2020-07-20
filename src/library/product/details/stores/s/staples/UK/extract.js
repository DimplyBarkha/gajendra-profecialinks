const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'staples',
    transform: transform,
    domain: 'staples.co.uk',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    // await context.setViewport({ width: 640, height: 480 });
    await context.evaluate(async function () {
      // @ts-ignore
      document.querySelector('#btnCookieContainer > input.accept-all-cookies').click();
      // @ts-ignore
      document.querySelector('div#light_box_global').click();
      const element = document.querySelector('div.skutabDesc');
      // @ts-ignore
      element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    });
    return await context.extract(productDetails, { transform });
  },
};
