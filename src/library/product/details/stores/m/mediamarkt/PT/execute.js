async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  var url = '';
  // if (inputs.id) {
  //   url = `https://www.falabella.com.ar/falabella-ar/product/${inputs.id}`;
  // } else {
  url = inputs.URL || inputs.url;
  // url += '#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]';
  // }
  await context.setBlockAds(false);
  await context.setLoadAllResources(true);
  await context.setLoadImages(true);
  await context.setJavaScriptEnabled(true);
  await context.setAntiFingerprint(false);
  await context.setUseRelayProxy(false);
  // const timeout = parameters.timeout ? parameters.timeout : 30000;

  await context.goto(url, {
    timeout: 100000,
    waitUntil: 'load',
    checkBlocked: true,
  });
  const applyScroll = async function (context) {
    console.log('calling applyScroll-----------');
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1000);
        scrollTop += 1000;
        console.log('calling applyScroll evaluate-----------', window);
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  await context.waitForNavigation({ waitUntil: 'load' });
  return true;
  // return await context.evaluate(function (xp) {
  //   const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  //   return !r;
  // }, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PT',
    store: 'mediamarkt',
    domain: 'mediamarkt.pt',
    loadedSelector: null,
    noResultsXPath: "//div[@class='page-404']",
    zipcode: '',
  },
  implementation,
};
