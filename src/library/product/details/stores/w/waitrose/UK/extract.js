
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
      const availableStatus = document.querySelector('button[data-origincomponent="AddToTrolley"]') ? 'In stock' : 'Out of stock';
      document.querySelector('body').setAttribute('available_status', availableStatus);

      const breadcrumb = document.querySelectorAll('ul[class="crumbs___SEVo6"]>li');

      if (breadcrumb) {
        let categoryRanking;
        breadcrumb.forEach(el => { categoryRanking = (categoryRanking ? `${categoryRanking} > ` : '') + el.textContent });
        document.querySelector('body').setAttribute('category_ranking', categoryRanking);
      }
    });
    await context.extract(productDetails);
  },
};
