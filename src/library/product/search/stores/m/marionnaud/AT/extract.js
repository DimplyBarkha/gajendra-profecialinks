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
    const cookies = await context.evaluate(async () => {
      document.querySelector('button#onetrust-accept-btn-handler');
    });
    if (cookies) cookies.click();
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    await context.evaluate(async () => {
      const totalNoOfResults = document.querySelector('div[data-total-amount')
        ? parseInt(document.querySelector('div[data-total-amount').getAttribute('data-total-amount')) : 0;
      const numOfPages = Math.ceil((totalNoOfResults) / 20);

      if (document.querySelector('button[data-ref="loadMoreBtn"]')) {
        for (let i = 0; i <= numOfPages; i++) {
          document.querySelector('button[data-ref="loadMoreBtn"]').click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        }
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    await context.evaluate(async () => {
      const allProducts = document.querySelectorAll('div[data-component=MasonryGrid] div.product-tile__container');
      for (let i = 0; i < allProducts.length && i < 150; i++) {
        const brand = allProducts[i].querySelector('a.product-tile__brand') ? allProducts[i].querySelector('a.product-tile__brand').textContent.trim() : '';
        const subtitle = allProducts[i].querySelector('a.product-tile__description') ? allProducts[i].querySelector('a.product-tile__description').textContent.trim() : '';
        allProducts[i].setAttribute('product-tile-name', `${brand} ${subtitle}`);
        const productUrl = allProducts[i].querySelector('div.product-tile__container a[data-product-link]') ? allProducts[i].querySelector('div.product-tile__container a[data-product-link]').getAttribute('href') : '';
        allProducts[i].setAttribute('product-tile-url', `https://www.marionnaud.at${productUrl}`);
        allProducts[i].setAttribute('product-tile-id', productUrl.replace(/.*\/p\/(.*)/g, '$1'));
        const oldPrice = allProducts[i].querySelector('a.product-tile__price span.text--gray-dark') ? allProducts[i].querySelector('a.product-tile__price span.text--gray-dark').textContent : '';
        const price = allProducts[i].querySelector('a.product-tile__price span.text--pink') ? allProducts[i].querySelector('a.product-tile__price span.text--pink').textContent : oldPrice;
        allProducts[i].setAttribute('product-tile-price', price);
        const searchUrl = window.location.href;
        allProducts[i].setAttribute('search-url', searchUrl);
        const thumbnail = allProducts[i].querySelector('img.product-tile__image') ? allProducts[i].querySelector('img.product-tile__image').getAttribute('src').replace(/(\/medias.*)/g, 'https://www.marionnaud.at$1') : '';
        allProducts[i].setAttribute('thumbnail', thumbnail);
        const aggregateRating = allProducts[i].querySelector('div[data-ref=stars]') ? allProducts[i].querySelector('div[data-ref=stars]').getAttribute('data-rating').replace(/(\d+)\.?,?(\d+)?/g, '$1,$2') : '';
        allProducts[i].setAttribute('aggregateRating', aggregateRating);
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
