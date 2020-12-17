
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'BE',
    domain: 'pharmasimple.com',
    store: 'pharmasimple',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const categories = document.querySelectorAll('a[data-type="category"],a[data-type="brands"], li.menuHaveNoMobileSubMenu a');
      for (let i = 0; i < categories.length; i++) {
        const categoryName = categories[i] ? categories[i].textContent.trim() : '';
        categories[i].setAttribute('categoryName', categoryName);
        const categoryUrl = categories[i] ? categories[i].getAttribute('href') : '';
        categories[i].setAttribute('categoryUrl', `https://pharmasimple.com/fr${categoryUrl}`);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.extract(productMenu);
  },
};
