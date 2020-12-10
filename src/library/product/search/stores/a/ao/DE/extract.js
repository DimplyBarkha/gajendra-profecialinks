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
          rating[n].setAttribute('normrating', rating[n].getAttribute('content').replace('.', ','));
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
