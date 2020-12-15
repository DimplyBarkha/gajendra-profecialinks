
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'booker.co.uk',
    store: 'booker',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const categories = document.querySelectorAll('div#MenuName+dl *[cat]');
      for (let i = 0; i < categories.length; i++) {
        const categoryOnclickBtn = categories[i] ? categories[i].getAttribute('onclick') : '';
        const categoryUrlBtn = categoryOnclickBtn && categoryOnclickBtn.match('window.location') ? decodeURIComponent(categoryOnclickBtn.replace(/^.*url=(.*)';?/g, '$1')) : '';
        const categoryId = categories[i] ? categories[i].getAttribute('cat') : '';
        const catrgoryUrlId = categoryId ? `https://www.booker.co.uk/catalog/products.aspx?categoryName=${categoryId}` : '';
        if (categoryUrlBtn) {
          categories[i].setAttribute('productUrl', categoryUrlBtn.replace('http:', 'https:'));
        } else categories[i].setAttribute('productUrl', catrgoryUrlId);
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.extract(productMenu);
  },
};
