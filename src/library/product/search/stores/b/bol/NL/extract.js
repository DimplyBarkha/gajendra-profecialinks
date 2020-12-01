const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  // the popup is visible after a moment -> delaying the removal
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const isPopupPresent = await context.evaluate(async () => {
    return document.querySelector('div.modal__overlay');
  });
  // when the popup is present it returns undefined, when not - null
  if (isPopupPresent !== null && isPopupPresent !== undefined) {
    await context.evaluate(() => {
      document.querySelector('button.js-confirm-button').click();
    });
  }

  await context.evaluate(async () => {
    // scroll
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    let scrollTop = 0;
    const scrollLimit = 10000;
    while (scrollTop <= scrollLimit) {
      await stall(500);
      scrollTop += 300;
      window.scroll(0, scrollTop);
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await context.evaluate(() => {
    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    };

    const product = document.querySelectorAll('li.product-item--row.js_item_root');
    const searchUrl = window.location.href;
    let rankOrganic = 0;
    let ratings = document.querySelectorAll('.star-rating');
    const itereationLength = ratings.length;
    let seller;
    const productUrlAll = document.querySelectorAll('.h-o-hidden>a');
    let productUrl;
    let price;
    const priceSelector = document.querySelectorAll('meta[itemprop="price"]');
    let newprice;
    let j = 0;

    priceSelector.forEach(element => {
      price = element.content
      newprice = price.replace('.', ',');
      addProp('meta[itemprop="price"]', j, 'newprice', newprice);
      j++;
    });

    let rating;
    const ratingSelector = document.querySelectorAll('.star-rating');
    let newRating;
    j = 0;
    ratingSelector.forEach(element => {
      rating = element.title;
      newRating = rating.replace('.', ',');
      rating = newRating.match(/[0-9,]{3}/);
      addProp('.star-rating', j, 'newrating', rating);
      j++;
    });

    for (let i = 0; i < itereationLength; i++) {
      ratings = document.querySelectorAll('.star-rating')[i].dataset.count;
      seller = document.querySelectorAll('div[data-test="plazaseller-link"]')[i];

      if (ratings === undefined && ratings !== null) {
        ratings = '0';
      };

      if (seller !== undefined && seller !== null) {
        seller = seller.textContent;
        seller = seller.replace(/\s/g, ' ');
      } else {
        seller = 'Seller is not known';
      };

      if (productUrlAll[i].href.includes('https')) {
        productUrl = productUrlAll[i].href;
      } else {
        productUrl = 'https://www.bol.com' + productUrlAll[i].href;
      }

      if (!product[i].innerHTML.includes('h-color-subtext h-bottom--xs small_details')) {
        rankOrganic++;
        addProp('wsp-buy-block.product-item__options.hit-area', i, 'rankorganic', rankOrganic);
      };

      addProp('.h-o-hidden>a', i, 'producturl', productUrl);
      addProp('.star-rating', i, 'ratingsCount', ratings);
      addProp('wsp-buy-block.product-item__options.hit-area', i, 'seller', seller);
      addProp('wsp-buy-block.product-item__options.hit-area', i, 'rank', `${i + 1}`);
    };
    addProp('.h-o-hidden>a', 0, 'currenturl', searchUrl);
  });
  return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    transform,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation,
};
