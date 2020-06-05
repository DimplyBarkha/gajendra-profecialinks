
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    transform: null,
    domain: 'waitrose.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const availableStatus = document.querySelector('button.add-to-cart-button__full-button') ? 'In stock' : 'Out of stock';
      document.querySelector('body').setAttribute('availableStatus', 'In Stock');

      const breadcrumb = document.querySelectorAll('ul[class="crumbs___SEVo6"]>li');

      if (breadcrumb) {
        let categoryRanking;
        breadcrumb.forEach(el => { categoryRanking = (categoryRanking ? `${categoryRanking} > ` : '') + el.textContent });
        document.querySelector('body').setAttribute('categoryRanking', categoryRanking);
      }
    });
    await context.extract(productDetails);
  },
};
