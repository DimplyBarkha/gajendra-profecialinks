const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'expert',
    transform: transform,
    domain: 'expert.at',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails, Helpers, SharedHelpers }) => {
    const sharedhelpers = new SharedHelpers(context);

    let content = null;
    let image = null;

    const link = await context.evaluate(async function () {
      return window.location.href;
    });

    const apiManufCall = await context.evaluate(async function () {
      return document.querySelector('iframe#loadbeeTabContent') ? document.querySelector('iframe#loadbeeTabContent').getAttribute('src') : null;
    });

    if (apiManufCall) {
      const obj = await sharedhelpers.goToiFrameLink(apiManufCall, link, 'body img', 'src');
      content = obj.content;
      image = obj.image;
      sharedhelpers.addHiddenInfo('ii_manufContent', content);
      if (image.length) {
        sharedhelpers.addHiddenInfo('ii_manufImg', image.join(' || '));
      }
    }

    const loadManufactuter = await context.evaluate(async function () {
      return document.querySelector('li#tab-nav-external-content');
    });

    if (loadManufactuter) {
      await context.evaluate(async function () {
        if (document.querySelector('a[href="#tab-external-content"]')) {
          document.querySelector('a[href="#tab-external-content"]').click();
        }
      });
    }

    const urlLink = await context.evaluate(async function () {
      return window.location.href;
    });

    sharedhelpers.addHiddenInfo('iio_product_url', urlLink);

    let ratingReviews = await sharedhelpers.getEleByXpath('//script[contains(@type, "application/ld+json") and contains(text(), "Product")]');

    console.log('ratingReviews');
    console.log(ratingReviews);
    ratingReviews = Object.keys(JSON.parse(ratingReviews)).length ? JSON.parse(ratingReviews) : null;

    console.log('ratingReviews');
    console.log(ratingReviews);

    if (ratingReviews) {
      sharedhelpers.addHiddenInfo('iio_rating', ratingReviews && ratingReviews.aggregateRating && ratingReviews.aggregateRating.ratingValue ? ratingReviews.aggregateRating.ratingValue.replace('.', ',') : '');
      sharedhelpers.addHiddenInfo('iio_rating_count', ratingReviews && ratingReviews.aggregateRating && ratingReviews.aggregateRating.reviewCount ? ratingReviews.aggregateRating.reviewCount : '');
    }

    await context.waitForFunction(function (sel) {
      return Boolean(document.querySelector(sel));
    }, { timeout: 20000 }, 'body');

    return await context.extract(productDetails, { transform: transformParam });
  },
};
