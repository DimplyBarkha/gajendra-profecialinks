module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'rossmann',
    domain: 'rossmann.de',
    loadedSelector: 'div[class="rm-tile-product"]',
    noResultsXPath: '//h3[contains(@class,"rm-alert")]',
    reviewUrl: 'https://www.rossmann.de/de/search/?text={id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation: async function ({ url, id, zipcode, date, days }, { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
    context,
    dependencies,
  ) {
    const patternReplace = () => {
      if (!reviewUrl) throw new Error('No pattern provided to generate a valid URL');
      let tempUrl = reviewUrl;
      if (id) tempUrl = tempUrl.replace(/{id}/g, encodeURIComponent(id));
      if (date) tempUrl = tempUrl.replace(/{date}/g, encodeURIComponent(date));
      if (days) tempUrl = tempUrl.replace(/{days}/g, encodeURIComponent(days));
      return tempUrl;
    };
    const destinationUrl = url || patternReplace();

    await dependencies.goto({ url: destinationUrl, zipcode });

    if (sortButtonSelectors) {
      const selectors = sortButtonSelectors.split('|');
      for (const selector of selectors) {
        await context.click(selector);
      }
    }
    if (loadedSelector) {
      await context.waitForFunction((sel, xp) => {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, loadedSelector, noResultsXPath);
    }

    const productDetailsLink = await context.evaluate(async function (id) {
      const productList = document.querySelectorAll('div.rm-tile-product a.rm-tile-product__image');
      for (let i = 0; i < productList.length; i++) {
        const productRpc = productList[i].getAttribute('data-product-id');
        if (productRpc.includes(id) || productList.length === 1) {
          return productList[i].getAttribute('href');
        }
      }
      return null;
    }, id);
    console.log('product details link');
    console.log(productDetailsLink);
    if (productDetailsLink) {
      const url = `https://www.rossmann.de${productDetailsLink}`;
      await context.goto(url, {
        timeout: 30000,
        waitUntil: 'load',
        checkBlocked: true,
      });
    }

    try {
      await context.waitForXPath('//div[@data-bv-target="review"]', { timeout: 30000 });
      await context.evaluate(async () => {
        if (document.querySelector('div[id*="onetrust"] > div > button[id*="accept"]')) {
          document.querySelector('div[id*="onetrust"] > div > button[id*="accept"]').click();
        }
        document.body.setAttribute('url', window.location.href);
      });
      await context.waitForSelector('span[class="bv-dropdown-arrow"]', { timeout: 10000 });
      await context.evaluate(async () => {
        const btn = document.querySelector('span[class="bv-dropdown-arrow"]');

        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
        await stall(5000);
        if (btn) {
          btn.scrollIntoView();
          btn.click();
          await stall(1000);
          const ddOption = document.querySelector('ul[id="bv-dropdown-select-reviews-sortby"] > li[id*="mostRecent"]');
          if (ddOption) {
            ddOption.click();
            await stall(1000);
            document.body.setAttribute('mark', 'donesorting');
          }
        }
        await stall(5000);
        document.body.setAttribute('firstrevdate', document.querySelector('li meta[itemprop="datePublished"]').getAttribute('content'));
      });
    } catch (e) {
      console.log('sort out button is not present');
    }

    console.log('Checking no results', noResultsXPath);
    return await context.evaluate((xp) => {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, noResultsXPath);
  },
};
