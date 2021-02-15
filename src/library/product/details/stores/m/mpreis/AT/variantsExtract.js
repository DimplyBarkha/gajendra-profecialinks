
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    transform: null,
    domain: 'shop.mpreis.at',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { createUrl, variants } = dependencies;
    await context.evaluate(function () {
      const variantsLinks = document.querySelectorAll('.panel-title a');
      variantsLinks.forEach(variantsLink => {
        const href = variantsLink.getAttribute('href');
        variantsLink.setAttribute('href', `${window.location.href}${href}`);
      })
    }, createUrl);
  return await context.extract(variants);
  },
};
