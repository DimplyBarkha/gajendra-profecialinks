
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'ZA',
    domain: 'pnp.co.za',
    store: 'pnp',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const categories = document.querySelectorAll('ul.nav.nav-pills.js-offcanvas-links.container li>a');
      for (let i = 0; i < categories.length; i++) {
        const categoryName = categories[i] ? categories[i].getAttribute('title').trim() : '';
        categories[i].setAttribute('categoryName', categoryName);
        const categoryHref = categories[i] ? categories[i].getAttribute('href') : '';
        const categoryUrl = categoryHref ? categoryHref.replace(/^\//g, 'https://www.pnp.co.za/') : '';
        categories[i].setAttribute('categoryUrl', categoryUrl);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.extract(productMenu);
  },
};
