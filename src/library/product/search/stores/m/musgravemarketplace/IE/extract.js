const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'musgravemarketplace',
    transform: transform,
    domain: 'musgravemarketplace.ie',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async () => {
      const currentUrl = window.location.href;
      const products = document.querySelectorAll('form#products-list table[class*="list_item"]');
      products.forEach(product => {
        product.setAttribute('searchurl', currentUrl);
      });
    });

    var extractedData = await context.extract(productDetails, { transform });

    extractedData.forEach(page => {
      page.group.forEach(row => {
        if (row.thumbnail) {
          row.thumbnail[0].text = row.thumbnail[0].text.replace('tn', 'lr');
        }
      });
    });

    return extractedData;
  },
};
