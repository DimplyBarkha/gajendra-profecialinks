
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

    const pageLoader = (url.includes('search?')) ? 'div.product-listing.row' : 'div#pageContent';
    const ageBtn = 'button#bouncer_modal_submit';

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

  },
};
