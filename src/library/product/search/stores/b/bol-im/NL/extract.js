// @ts-nocheck
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'bol-im',
    transform,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const body = document.body;
      const html = document.documentElement;
      const pageHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
      );

      let scrollTop = 0;
      while (scrollTop <= pageHeight) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        scrollTop += 600;
        window.scroll(0, scrollTop);
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    await context.evaluate(() => {
      const addProp = (selector, iterator, propName, value) => {
        document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
      };

      const searchUrl = window.location.href;
      let ratings = document.querySelectorAll('.star-rating');
      const itereationLength = ratings.length;
      let seller;
      const productUrlAll = document.querySelectorAll('.h-o-hidden>a');
      let productUrl;
      let price;
      const priceSelector = document.querySelectorAll('meta[itemprop="price"]');
      let newprice;
      let j = 0;

      priceSelector.forEach((element) => {
        price = element.content;
        newprice = price.replace('.', ',');
        addProp('meta[itemprop="price"]', j, 'newprice', newprice);
        j++;
      });

      let rating;
      const ratingSelector = document.querySelectorAll('.star-rating');
      let newRating;
      j = 0;
      ratingSelector.forEach((element) => {
        rating = element.title;
        newRating = rating.replace('.', ',');
        rating = newRating.match(/[0-9,]{3}/);
        if (rating) addProp('.star-rating', j, 'newrating', rating);
        j++;
      });

      for (let i = 0; i < itereationLength; i++) {
        ratings = document.querySelectorAll('.star-rating')[i].dataset.count;
        seller = document.querySelectorAll('div[data-test="plazaseller-link"]')[i];

        if (ratings === undefined && ratings !== null) {
          ratings = '0';
        }

        if (seller !== undefined && seller !== null) {
          seller = seller.textContent;
          seller = seller.replace(/\s/g, ' ');
        } else {
          seller = 'Seller is not known';
        }

        if (productUrlAll[i].href.includes('https')) {
          productUrl = productUrlAll[i].href;
        } else {
          productUrl = 'https://www.bol.com' + productUrlAll[i].href;
        }

        addProp('.h-o-hidden>a', i, 'producturl', productUrl);
        addProp('.star-rating', i, 'ratingsCount', ratings);
        addProp('wsp-buy-block.product-item__options.hit-area', i, 'seller', seller);
      }
      addProp('.h-o-hidden>a', 0, 'currenturl', searchUrl);
    });
    return await context.extract(productDetails, { transform });
  },
};
