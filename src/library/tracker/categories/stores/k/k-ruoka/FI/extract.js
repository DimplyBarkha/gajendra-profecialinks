
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'FI',
    domain: 'k-ruoka.fi',
    store: 'k-ruoka',
    zipcode: '',
  },
};

implementation: async (inputs, properties, context, { productMenu }) => {
  await context.evaluate(async () => {
    const categoryUrlList = document.createElement('ul');
    categoryUrlList.id = 'category-url-list';
    const categories = document.querySelectorAll('ul.product-category-list > li');
    categories.forEach((category) => {
      let categoryUrl = category.firstChild.href;
      });
  });
}
