
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
      return Boolean(document.querySelector('.sc-modal-content > div button'));
    }, { timeout: 10000 });
  } catch (err) {
    console.log('No pop found after wait');
  }

  await new Promise((resolve, reject) => setTimeout(resolve, 6000));

  await context.evaluate(() => {
    const elem = document.querySelector('.sc-modal-content > div button');
    if (!elem) return;
    console.log('Clicking on popup btn');
    elem.click();
  });

  if (loadedSelector) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 20000 }, loadedSelector, noResultsXPath);
  }

  console.log('Checking no results', noResultsXPath);

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

  await context.evaluate(function () {
    const reviewDate = document.evaluate('//ol[contains(@class,\'bv-content-list-reviews\')]//li[1]//div[contains(@class,\'bv-content-datetime\')]/meta[contains(@itemprop,\'dateCreated\')]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.content;
    console.log('last review date: ' + reviewDate);
    // Bind to the product details
    const lastReviewDateElem = document.createElement('div');
    lastReviewDateElem.id = 'lastReviewDate';
    lastReviewDateElem.innerText = reviewDate;
    document.body.appendChild(lastReviewDateElem);
  });

  return true;
}

module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
    loadedSelector: 'ol.bv-content-list-reviews > li',
    noResultsXPath: '//div[@class="sc-error-page"]',
    reviewUrl: 'https://www.samsclub.com/p/{id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation,
};
