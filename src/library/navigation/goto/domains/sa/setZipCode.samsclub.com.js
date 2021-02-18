
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'samsclub.com',
    store: 'samsclub',
    zipcode: '',
  },
  implementation: async ({ url, RPC, SKU, zipcode, storeId, postcode }, { country, domain, timeout }, context, dependencies) => {
    await context.evaluate(async () => {
      const closePopupButton = document.querySelector('div.sc-block-modal button.sc-modal-close-button');
      if (closePopupButton) {
        // @ts-ignore
        closePopupButton.click();
      }
    });
    const storeChangeUrl = `https://www.samsclub.com/club/springfield-mo-sams-club/${storeId}`;
    await context.goto(storeChangeUrl, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
    await new Promise(resolve => { setTimeout(resolve, 30000); });
    await context.click('div.sc-club-summary-action button');
    await context.evaluate(async () => {
      const makeClub = document.querySelector('div.sc-club-summary-action button');
      if (makeClub) {
        // @ts-ignore
        makeClub.click();
        await new Promise(resolve => { setTimeout(resolve, 60000); });
      }
      const closePopupButton = document.querySelector('div.sc-block-modal button.sc-modal-close-button');
      if (closePopupButton) {
        // @ts-ignore
        closePopupButton.click();
      }
    });
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  },
};
