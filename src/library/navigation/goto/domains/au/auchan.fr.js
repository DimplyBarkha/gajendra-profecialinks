
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'auchan.fr',
    timeout: 1000000,
    country: 'FR',
    store: 'auchan',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    //console.log('nilesh')
    // if (url.toString().indexOf('https://www.auchan.fr/recherche') > -1) {
    //   // await context.goto('https://www.auchan.fr/magasins/drive/aubagne-en-provence/s-684734ad-027c-3eff-0e83-4f44aec5e0b8#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]', {
    //   //   timeout: 10000000,
    //   //   waitUntil: 'load',
    //   //   checkBlocked: true,
    //   //   js_enabled: true,
    //   //   css_enabled: false,
    //   //   random_move_mouse: true,
    //   // });
    //   // await context.waitForSelector('button.journeyChoicePlace')
    //   // await context.click('button.journeyChoicePlace')
    //   // await context.stop();
    //   await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    // } else {
    //await context.goto(url + '#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]', { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    // }
    await context.stop();
    await context.goto('https://www.auchan.fr/courses', {
      timeout: 10000000,
      waitUntil: 'networkidle0',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
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
      if (el && el.innerText.indexOf("Paris") === -1) {
        //document.querySelector('.context-header button.context-header__button').click();
        return '.context-header button.context-header__button';
      }
      else
        return null;
    });
    console.log('chooseDriveSelector', chooseDriveSelector)
    //await new Promise((resolve, reject) => setTimeout(resolve, 40000));
    if (chooseDriveSelector) {
      await context.waitForSelector(chooseDriveSelector)
      await context.click(chooseDriveSelector)
      // await context.click(chooseDriveSelector)
      // await context.click(chooseDriveSelector)
      // await context.click(chooseDriveSelector)
      await context.waitForSelector('input.journeySearchInput')
      await context.setInputValue('input.journeySearchInput', '75020');
      await context.waitForSelector('li.journey__search-suggest')
      await context.click('li.journey__search-suggest')
      await context.waitForSelector('.journey-offering-context__wrapper .journey-offering-context__actions button')
      await context.click('.journey-offering-context__wrapper .journey-offering-context__actions button')
    }
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    // if (zipcode) {
    //   await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    // }
  }
};
