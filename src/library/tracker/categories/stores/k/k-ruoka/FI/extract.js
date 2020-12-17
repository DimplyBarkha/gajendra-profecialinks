
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'FI',
    domain: 'k-ruoka.fi',
    store: 'k-ruoka',
    zipcode: '',
  },

  implementation: async (inputs, properties, context, dependencies) => {
    const { productMenu } = dependencies;

    await context.evaluate(async () => {   
      const buttonsContainer = document.querySelector('.buttons-container');
      if(buttonsContainer) {
      buttonsContainer.lastElementChild.click();
      };

      const categories = document.querySelectorAll('ul.product-category-list > li');
      categories.forEach((category) => {
        let categoryUrl = category.firstChild.href;
        category.setAttribute('src', categoryUrl);
        });
    });
    return await context.extract(productMenu);
  }
};