
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'thevaporshoppeusa.com',
    timeout: 50000,
    country: 'US',
    store: 'thevaporshoppeusa',
    zipcode: "''",
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });

    const pageLoader = (url.includes("search?")) ? 'div.product-listing.row' : 'div#pageContent';

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

    if (!url.includes("search?")) {
      const reviewsAvailable = await isSelectorAvailable(cssReviews);
      if (reviewsAvailable) {
        await context.click(cssReviews);
      }
      await context.waitForSelector(cssReviewsRow, { timeout: 5000 });
    }
  }
};
