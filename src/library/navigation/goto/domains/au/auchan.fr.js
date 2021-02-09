module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'auchan.fr',
    timeout: 1000000,
    country: 'FR',
    store: 'auchan',
    zipcode: '',
  },
  dependencies: {
    helperModule: 'module:helpers/helpers',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const { helperModule: { Helpers } } = dependencies;
    const helper = new Helpers(context);
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const locationSelector = await context.evaluate(function () {
      return !!document.evaluate('//span[contains(@class,"context-header__pos") and text()="Paris"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    if (!locationSelector) {
      await context.setCssEnabled(true);
      await context.setAntiFingerprint(false);
      await context.setJavaScriptEnabled(true);
      await context.setBlockAds(false);
      await context.setLoadAllResources(true);
      await context.setLoadImages(true);
      await context.setBypassCSP(true);
      await context.setUseRelayProxy(false);
      await context.goto('https://www.auchan.fr/courses', { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });

      try {
        await context.waitForSelector('.context-header button.context-header__button', { timeout: 10000 });
        // await this.context.click('.context-header button.context-header__button', { timeout: 2000 });
        await context.evaluate(function () {
          const clickModelSelector = document.querySelector('.context-header button.context-header__button');
          console.log('clickModelSelector', clickModelSelector);
          if (clickModelSelector) clickModelSelector.click();
        });
        await context.waitForSelector('input.journeySearchInput', { timeout: 10000 });
        await context.setInputValue('input.journeySearchInput', '75020');
        const modelLocationClick = async () => {
          await helper.ifThereClickOnIt('input.journeySearchInput');
        };
        await modelLocationClick();
        await context.waitForSelector('li.journey__search-suggest', { timeout: 10000 });
        await context.evaluate(async function () {
          const journeySelector = document.querySelector('li.journey__search-suggest');
          if (journeySelector) journeySelector.click();
        });
        await context.waitForSelector('.journey-offering-context__wrapper .journey-offering-context__actions button', { timeout: 10000 });
        await context.evaluate(function () {
          const journeyOfferingSelector = document.querySelector('.journey-offering-context__wrapper .journey-offering-context__actions button');
          if (journeyOfferingSelector) journeyOfferingSelector.click();
        });
      } catch (error) {
      }
      await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    } else {
      await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    }
  },
};
