async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      let documentScrollHeight = document.body.scrollHeight;
      while (scrollTop < documentScrollHeight) {
        await stall(2000);
        scrollTop += 600;
        window.scroll(0, scrollTop);
        documentScrollHeight = document.body.scrollHeight;
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

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  const productsCount = await context.evaluate(async function () {
    const element = document.evaluate('//div[@class="listingDesktop-pagination_top-173"]//span[@class="paginationCss-count-3Dp"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (element.singleNodeValue) {
      let txt = element.singleNodeValue.textContent;
      txt = txt.replace('z ', '');
      const count = parseInt(txt);
      return count;
    }
    return false;
  });
  if (productsCount === false) {
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, parameters.noResultsXPath);
  }
  const count = 1;
  for (let i = 0; i < 8; i++) {
    const loadMoreLink = await context.evaluate((selector) => !!document.querySelector(selector), 'div[data-selector*="pagination"]:last-child button:last-child');
    const currentPage = await context.evaluate(function () {
      const element = document.evaluate('//div[@class="listingDesktop-pagination_top-173"]//input[@class="paginationCss-pages__input-UEV"]/@value', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (element.singleNodeValue) {
        const txt = element.singleNodeValue.textContent;
        return parseInt(txt);
      }
      return 0;
    });
    console.log('loadMoreLink :' + loadMoreLink + ', current page:' + currentPage + ', estimated products:' + productsCount);

    if (productsCount === false || productsCount === 1 || count === 1) {
      // Scroll down the page to load results
      await applyScroll(context);
      break;
    }

    if (productsCount <= currentPage) {
      break;
    }

    if (loadMoreLink && currentPage > 0 && currentPage < 2) {
      console.log('Clicking load more', loadMoreLink);
      await context.waitForSelector('div[data-selector*="pagination"]:first-child button:last-child', { timeout: 10000 });
      const element = await context.evaluate(function () {
        return document.querySelector('div[data-selector*="pagination"]:first-child button:last-child');
      });
      console.log('element :', element);
      await context.click('div[data-selector*="pagination"]:first-child button:last-child');

      if (parameters.loadedSelector) {
        await context.waitForFunction(function (sel, xp) {
          return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
        }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
      }
    } else {
      break;
    }
    // Scroll down the page to load results
    await applyScroll(context);
  }
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
    country: 'PL',
    store: 'neonet',
    domain: 'neonet.pl',
    url: 'https://www.neonet.pl/search.html?order=score&query={searchTerms}',
    loadedSelector: 'section.listingDesktop-gallery-3uP',
    noResultsXPath: '//div[@class="noSearchResults-message-WsY"]',
    zipcode: '',
  },
  implementation,
};
