
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'casinodrive.fr',
    timeout: 50000,
    country: 'FR',
    store: 'casinodrive',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.goto('https://www.casino.fr/prehome/courses-en-ligne/carte-des-magasins/Bourg-en-Bresse%20(01000)', {
      timeout: 40000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    await context.waitForSelector('div[class*="map-box__block-store"]:first-of-type a[class*="block-store__main-link"]');
    await context.click('div[class*="map-box__block-store"]:first-of-type a[class*="block-store__main-link"]');
    await context.stop();

    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url, zipcode });
    }
  },
};
