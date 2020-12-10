const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'ao',
    transform: transform,
    domain: 'ao.de',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      const accCookie = document.querySelector('button.ao-cb__button.ao-cb__button--accept');
      if (accCookie) {
        // @ts-ignore
        accCookie.click();
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      const promoClose = document.querySelector('button.promotionModalClose.icon-close.c-modal-close.u-pos--absolute.ico.ico-close.ico-lg');
      if (promoClose) {
        // @ts-ignore
        promoClose.click();
      }
    });
    await context.evaluate(async function () {
      const rating = document.querySelectorAll('ul.o-flex-container li meta[itemprop="ratingValue"]');
      if (rating) {
        for (let n = 0; n < rating.length; n++) {
          // @ts-ignore
          rating[n].setAttribute('normrating', rating[n].content.replace('.', ','));
        }
      }
      const promotedProducts = document.querySelectorAll("li[data-testid='product-card--featured']");
      if (promotedProducts) {
        localStorage.setItem('promotedProductsNumber', `${promotedProducts.length}`);
      }
      const promotedProductsNumber = localStorage.getItem('promotedProductsNumber') ? Number(localStorage.getItem('promotedProductsNumber')) : 0;
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const arr = document.querySelectorAll('li.product-card__wrapper meta[itemprop="position"]');
      for (let i = 0; i < arr.length; i++) {
        // @ts-ignore
        arr[i].setAttribute('rank', lastProductPosition + i);
      }
      const arr2 = document.querySelectorAll('li.product-card__wrapper[data-testid="product-card--standard"] meta[itemprop="position"]');
      for (let j = 0; j < arr2.length; j++) {
        // @ts-ignore
        arr2[j].setAttribute('rankorganic', lastProductPosition - 1 + promotedProductsNumber + j);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + arr.length}`);
      localStorage.setItem('promotedProductsNumber', `${promotedProductsNumber + arr2.length}`);
    });
    return await context.extract(productDetails, { transform });
  },
};
