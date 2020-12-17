async function implementation (
  { url, id, zipcode, date, days },
  { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
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

  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await stall(1000);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
    console.log('Finished scrolling');
  };

  await applyScroll(context);

  try {
    await context.waitForFunction(() => {
      return Boolean(document.querySelector('div.Banner-contentWrap > button'));
    }, { timeout: 10000 });
  } catch (err) {
    console.log('no load reviews button found after wait');
  }

  await context.evaluate(() => {
    const elem = document.querySelector('div.Banner-contentWrap > button');
    if (!elem) return;
    console.log('Clicking on load reviews button');
    elem.click();
  });

  if (loadedSelector) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }

  const sortExists = await context.evaluate(async function () {
    const elem = document.querySelector('.pl-DropdownInput');
    if (!elem) return;
    console.log('Clicking on load reviews button');
    // @ts-ignore
    elem.click();
    const sortElement = document.evaluate('//li[contains(@class,\'pl-DropdownMenu-option\')][contains(.,\'Latest\')]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
    if (!sortElement) return;
    console.log('Selecting latest reviews');
    // @ts-ignore
    sortElement.click();
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    return true;
  });

  if (sortExists) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }

  const checkIfResults = await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);

  if (!checkIfResults) {
    return false;
  }

  return true;
}

module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    domain: 'wayfair.com',
    loadedSelector: 'div.pl-Container> div > article',
    noResultsXPath: '//div[@class="RatingBlock"]/p[contains(.,"no review")]',
    zipcode: '',
  },
  implementation,
};
