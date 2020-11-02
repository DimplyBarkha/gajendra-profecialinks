
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
    await context.goto('https://www.auchan.fr/magasins/drive/aubagne-en-provence/s-684734ad-027c-3eff-0e83-4f44aec5e0b8', {
      timeout: 10000000,
      waitUntil: 'networkidle0',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    await context.evaluate(async function () {
      //await new Promise((resolve, reject) => setTimeout(resolve, 5000));
      document.querySelector('button.journeyChoicePlace').click();
    });
    //await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    context.goto(url + "#[!opt!]{\"user_agent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36\"}[/!opt!]", { "js_enabled": true, "css_enabled": true, "load_timeout": 60, "load_all_resources": true })
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  }
};
