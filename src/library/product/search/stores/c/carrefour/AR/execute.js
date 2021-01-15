
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 20000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);

  try {
    await context.setInputValue('input#search', inputs.keywords);
  } catch (e) {
    console.log(e);
  }

  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 3000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 3000) {
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
  for (let i = 0; i < 20; i++) {
    try {
      await applyScroll(context);
    } catch (e) {
      console.log(e);
    }
    try {
      await context.click('a.ver-mas-productos');
    } catch (e) {
      console.log(e);
    }
  }

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
    country: 'AR',
    store: 'carrefour',
    domain: 'carrefour.com.ar',
    url: 'https://www.carrefour.com.ar/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.home-product-cards',
    noResultsXPath: '//div[@class="no-results"]',
    zipcode: "''",
  },
  implementation,
};
