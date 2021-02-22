
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'footlocker.co.uk',
    timeout: 1000000,
    jsonToTable: null,
    country: 'UK',
    store: 'Footlocker',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":90000, "force200": true}[/!opt!]`;
    await context.goto(url, { block_ads: false, timeout: 500000, waitUntil: 'load', load_all_resources: true, images_enabled: true, checkBlocked: false });
    const elem = await context.evaluate(function () {
      return Boolean(document.querySelector('body > center:nth-child(1) > h1'));
    });
    if (elem) {
      return context.reportBlocked(404, 'Blocked!');
    }
    async function autoScroll(page) {
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
  }
};





