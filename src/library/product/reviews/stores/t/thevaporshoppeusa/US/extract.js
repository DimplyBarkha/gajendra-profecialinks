
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'thevaporshoppeusa',
    transform: null,
    domain: 'thevaporshoppeusa.com',
    zipcode: "''",
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { productReviews } = dependencies;

    const pageLoader = 'div#pageContent';
    const ageBtn = 'button#bouncer_modal_submit';
    const cssReviews = 'div[class="tt-tabs__head"] ul > li:nth-child(2) span';
    const cssReviewsRow = 'div.spr-content div.spr-review';

    const isSelectorAvailable = async (cssSelector) => {
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    await context.waitForSelector(pageLoader, { timeout: 10000 });

    const ageBtnAvailable = await isSelectorAvailable(ageBtn);
    if (ageBtnAvailable) {
      await context.click(ageBtn);
    }

    const reviewsAvailable = await isSelectorAvailable(cssReviews);
    if (reviewsAvailable) {
      await context.click(cssReviews);
    }

    await context.waitForSelector(cssReviewsRow, { timeout: 5000 });

    return await context.extract(productReviews);
  },
};
