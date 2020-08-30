
const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'conforama',
    transform,
    domain: 'conforama.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      let ratingCountSelector = document.querySelector('div[itemprop="ratingValue"]');
      // @ts-ignore
      let ratingCount = ratingCountSelector ? ratingCountSelector.innerText+'  avis' : '';
      addHiddenDiv('cc_ratingCount',ratingCount);
    });
    return await context.extract(productDetails, { transform });
  },
};
