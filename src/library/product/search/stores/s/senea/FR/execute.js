
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));

  const responseStatus = await context.goto(url, {
    firstRequestTimeout: 60000,
    timeout: 60000,
    waitUntil: 'load',
    checkBlocked: false,
  });

  console.log('Status :', responseStatus.status);
  console.log('URL :', responseStatus.url);

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  try {
    await context.waitForSelector('div[aria-label="fermer"]>div[data-visualcompletion="ignore"]', { timeout: 30000 });
    await context.click('div[aria-label="fermer"]>div[data-visualcompletion="ignore"]');
    console.log('successfully clicked the pop-up');
  } catch (e) {
    console.log('not able  to click pop-up')
  }
  // Apply scroll
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        const searchUrl = window.location.href;
        const appendElements = document.querySelectorAll('div[class="thumbnail-container"]');
        if (appendElements.length) {
          appendElements.forEach((element) => {
            if (element.getAttribute('searchurl') == null) {
              element.setAttribute('searchurl', searchUrl);
            }
          });
        }
        const products = document.evaluate('//article[contains(@class,"product-miniature")]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const productsCount = products.snapshotLength;
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await stall(3000);
        if (scrollTop >= 20000 || productsCount > 150) {
          await stall(10000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };

  await applyScroll(context);
  await context.evaluate(() => {
    const searchUrl = window.location.href;
    const appendElements = document.querySelectorAll('div[class="thumbnail-container"]');
    if (appendElements.length) {
      appendElements.forEach((element) => {
        if (element.getAttribute('searchurl') == null) {
          element.setAttribute('searchurl', searchUrl);
        }
      });
    }
  })

  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'senea',
    domain: 'senea.fr',
    url: "https://www.senea.fr/jolisearch?s={searchTerms}",
    loadedSelector: 'img[class="lozad"]',
    noResultsXPath: '//h4[contains(text(),"No result found")]',
    zipcode: '',
  },
  implementation,
};