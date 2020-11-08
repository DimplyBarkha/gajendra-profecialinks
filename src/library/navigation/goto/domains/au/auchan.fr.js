
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
    await context.goto(url + '#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]', { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    // }
    //await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  }
};
