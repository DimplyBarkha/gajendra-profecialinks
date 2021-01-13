
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'auchan.fr',
    timeout: 45000,
    country: 'FR',
    store: 'auchan',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.stop();
    await context.setCssEnabled(true);
    await context.setJavaScriptEnabled(true);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    /*
    await context.goto('https://www.auchan.fr/courses', {
      timeout: 10000000,
      waitUntil: 'load',
      // waitUntil: 'networkidle0',
      // checkBlocked: true,
      // js_enabled: true,
      // css_enabled: false,
      random_move_mouse: true,
    });
    const chooseDriveSelector = await context.evaluate(async function () {
      var el = document.querySelector('.context-header button.context-header__button');
      try {
        for (var i = 0; i < 10; i++) {
          document.querySelector('[autotrack-event-action="tutorial_click_useful"]').click();
        }
      } catch (err) { }

      console.log('nilesh', el.innerText);
      if (el && el.innerText.indexOf('Paris') === -1) {
        return '.context-header button.context-header__button';
      } else { return null; }
    });
    console.log('chooseDriveSelector', chooseDriveSelector);
    if (chooseDriveSelector) {
      await context.waitForSelector(chooseDriveSelector, { timeout: 45000 });
      await context.evaluate(async function(chooseDriveSelector) {
        if (document.querySelector(chooseDriveSelector)) {
          document.querySelector(chooseDriveSelector).click();
        }
      }, chooseDriveSelector);
      try {
        await context.waitForSelector('input.journeySearchInput', { timeout: 7000 });
        await context.setInputValue('input.journeySearchInput', '75020');
        await context.waitForSelector('li.journey__search-suggest');
        await context.click('li.journey__search-suggest');
        await context.waitForSelector('.journey-offering-context__wrapper .journey-offering-context__actions button');
        await context.click('.journey-offering-context__wrapper .journey-offering-context__actions button');
      } catch (error) {
        console.log('Not loading inputs for journey search');
      }
    //   await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, js_enabled: true, css_enabled: false, random_move_mouse: true });
    }
    // else {
      // await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, js_enabled: true, css_enabled: false, random_move_mouse: true });
    // }
    */
    const inputUrl = `${url}#[!opt!]{"discard_CSP_header":true, "block_ads": false}[/!opt!]`;
    await context.goto(inputUrl, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
  },
};
