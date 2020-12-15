
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'viking.de',
    store: 'viking',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const categories = document.querySelectorAll('li[class*="site-navigation__list-item site-navigation__list-item--level"]>a');
      for (let i = 0; i < categories.length; i++) {
        const categoryName = categories[i] ? categories[i].textContent.trim() : '';
        categories[i].setAttribute('categoryName', categoryName);
        const categoryUrl = categories[i] ? categories[i].getAttribute('href') : '';
        categories[i].setAttribute('categoryUrl', `https://www.viking.de${categoryUrl}`);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.extract(productMenu);
  },
};
