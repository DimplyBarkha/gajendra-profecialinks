const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    transform,
    domain: 'selfridges.uk',
    zipcode: "''",
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content, container) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        container.appendChild(newDiv);
      };
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(() => {
          window.scrollBy(0, 1000);
          resolve();
        }, 500));
      }
      const products = document.querySelectorAll('.c-listing-items__item');
      for (let i = 0; i < products.length; i++) {
        addHiddenDiv('import_page_url', location.href, products[i]);
      }
    });
    return await context.extract(data, { transform });
  },
};
