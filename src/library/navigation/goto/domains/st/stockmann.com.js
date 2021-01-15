
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'stockmann.com',
    timeout: 500000,
    country: 'FI',
    store: 'stockmann',
    zipcode: "''",
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    let url = `${inputs.url}`;
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"cookie_jar":[{"name":"user_allowed_save_cookie","value":"all"},{"name":"cookie_consent_preferences","value":"all"}], "block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { waitUntil: 'networkidle0', block_ads: false });
    async function autoScroll (page) {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    }
    await autoScroll(context);
    try {
      await context.click('button.js-accept-all');
    } catch (error) {
      console.log('No accept cookies button.');
    }
  },
};
