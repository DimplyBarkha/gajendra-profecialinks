
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'worten.pt',
    timeout: '100000',
    country: 'PT',
    store: 'worten',
  },
  // implementation: async ({ url }, parameters, context, dependencies) => {
  //   await context.setCssEnabled(true);
  //   await context.setAntiFingerprint(false);
  //   await context.setJavaScriptEnabled(true);
  //   await context.setBlockAds(false);
  //   await context.setLoadAllResources(true);
  //   await context.setLoadImages(true);
  //   const URL = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true,"force200": true}[/!opt!]`;
  //   await context.goto(URL, { timeout: 100000, waitUntil: 'load' });
  //   await context.waitForNavigation({ timeout: 100000, waitUntil: 'networkidle0' });
  // },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    let url = `${inputs.url}`;
    await context.setCssEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setJavaScriptEnabled(true);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { waitUntil: 'networkidle0', block_ads: false });
    async function autoScroll(page){
      await page.evaluate(async () => {
          await new Promise((resolve, reject) => {
              var totalHeight = 0;
              var distance = 100;
              var timer = setInterval(() => {
                  var scrollHeight = document.body.scrollHeight;
                  window.scrollBy(0, distance);
                  totalHeight += distance;
                  if(totalHeight >= scrollHeight){
                      clearInterval(timer);
                      resolve();
                  }
              }, 100);
          });
      });
  }
  await autoScroll(context);
  },
};
