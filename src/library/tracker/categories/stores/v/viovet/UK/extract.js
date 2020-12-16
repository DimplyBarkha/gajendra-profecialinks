
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'viovet.co.uk',
    store: 'viovet',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const categories = document.querySelectorAll('div#category-nav a');
      for (let i = 0; i < categories.length; i++) {
        const categoryName = categories[i] ? categories[i].textContent.trim() : '';
        categories[i].setAttribute('categoryName', categoryName);
        const categoryHref = categories[i] ? categories[i].getAttribute('href') : '';
        const categoryUrl = categoryHref ? categoryHref.replace(/^\//g, 'https://www.viovet.co.uk/') : '';
        categories[i].setAttribute('categoryUrl', categoryUrl);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.extract(productMenu);
  },
};
