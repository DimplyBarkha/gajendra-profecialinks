const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'monsterpetsupplies',
    transform: transform,
    domain: 'monsterpetsupplies.co.uk',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      const currentUrl = window.location.href;
      const products = document.querySelectorAll('div.product-list-item');
      if (products && products.length > 0) {
        products.forEach(product => {
          product.setAttribute('searchurl', currentUrl);
        });
      }
    });
    const extractedData = await context.extract(productDetails, { transform });

    const re = /upload(\/.+\d)\//;
    // thumbnail urls are corrupted by unnecessary text, we fix them by removing unnecessary part of url
    extractedData.forEach(page => {
      page.group.forEach(row => {
        if (row.thumbnail && (row.thumbnail[0].text.includes('f_auto') || row.thumbnail[0].text.includes('c_scale'))) {
          console.log(row.thumbnail[0].text);
          row.thumbnail[0].text = row.thumbnail[0].text.replace(re.exec(row.thumbnail[0].text)[1], '');
        }
      });
    });

    return extractedData;
  },
};
