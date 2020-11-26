const { transform } = require('../../../../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'Rewe',
    transform,
    domain: 'rewe.de',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.evaluate(() => {
      if (document.querySelector('div.uc-banner-content')) {
        document.querySelector('button#uc-btn-accept-banner').click();
      }
      const allProducts = document.querySelectorAll('div.search-service-product');
      for (let i = 0; i < allProducts.length; i++) {
        if ('div.search-service-ProductActions > meso-data') {
        const gtin = document.querySelectorAll('div.search-service-ProductActions > meso-data')[i].getAttribute('data-productid');
        document.querySelectorAll('input[name="listingId"]')[i].setAttribute('url', `https://shop.rewe.de/p/${gtin}`);
        document.querySelectorAll('input[name="listingId"]')[i].setAttribute('number', `${gtin}`);
      }
        else {
          const gtin = document.querySelectorAll('.search-service-rsProductsMedia>picture>img')[i].getAttribute('src').slice(24,40);
          document.querySelectorAll('input[name="listingId"]')[i].setAttribute('url', `https://shop.rewe.de/p/${gtin}`);
          document.querySelectorAll('input[name="listingId"]')[i].setAttribute('number', `${gtin}`); 
        }
    }
    });
    return await context.extract(productDetails, { transform });
  }
};
