const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'marionnaud',
    transform,
    domain: 'marionnaud.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      const cookies = document.querySelector('button#onetrust-accept-btn-handler');
      if (cookies) cookies.click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async () => {
      const totalNoOfResults = document.querySelector('div.more-data-loader__counter')
        ? parseInt(document.querySelector('div.more-data-loader__counter').innerText.replace(/.*von\s?(\d+).*/g, '$1')) : 0;

      const maxResultsToCollect = 150;
      if (totalNoOfResults > 20) {
        const numOfPages = totalNoOfResults < maxResultsToCollect ? Math.ceil((totalNoOfResults - 20) / 20) : Math.ceil((maxResultsToCollect - 20) / 20);
        for (let i = 0; i < numOfPages; i++) {
          const moreResultsBtn = document.querySelector('button[data-ref="loadMoreBtn"]');
          if (moreResultsBtn) moreResultsBtn.click();
        }
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  await context.evaluate(async () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    await context.evaluate(async () => {
      const allProducts = document.querySelectorAll('div.more-data-loader__content div[class*=product-tile__wrapper]');
      for (let i = 0; i < allProducts.length && i <= 150; i++) {
        const brand = allProducts[i].querySelector('a.product-tile__brand') ? allProducts[i].querySelector('a.product-tile__brand').innerText : '';
        const subtitle = allProducts[i].querySelector('a.product-tile__description') ? allProducts[i].querySelector('a.product-tile__description').innerText : '';
        allProducts[i].setAttribute('product-tile-name', `${brand} ${subtitle}`);
        const productUrl = allProducts[i].querySelector('div.product-tile__container a[data-product-link]') ? allProducts[i].querySelector('div.product-tile__container a[data-product-link]').href : '';
        allProducts[i].setAttribute('product-tile-url', productUrl);
        allProducts[i].setAttribute('product-tile-id', productUrl.replace(/.*\/p\/(.*)/g, '$1'));
        const oldPrice = allProducts[i].querySelector('a.product-tile__price span.text--gray-dark') ? allProducts[i].querySelector('a.product-tile__price span.text--gray-dark').innerText : '';
        const price = allProducts[i].querySelector('a.product-tile__price span.text--pink') ? allProducts[i].querySelector('a.product-tile__price span.text--pink').innerText : oldPrice;
        allProducts[i].setAttribute('product-tile-price', price);
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
