async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  let cookieBtnXpath = '//*[contains(@id,"acceptCookieButton")]';
  let cookieBtnPresent = false;
  try {
    await context.waitForXPath(cookieBtnXpath);
    cookieBtnPresent = true;
  } catch(err) {
    console.log('we got some error while waiting for cookie btn', err.message);
    try {
      await context.waitForXPath(cookieBtnXpath);
      cookieBtnPresent = true;
    } catch(error) {
      console.log('we got some error while waiting for cookie btn', error.message);
    }

  }

  console.log('cookieBtnPresent', cookieBtnPresent);
  if(cookieBtnPresent) {
    await context.evaluate(async (cookieBtnXpath) => {
      console.log('need to check for cookieBtnXpath',cookieBtnXpath);
      let elms = document.evaluate(cookieBtnXpath, document, null, 7, null);
      let btnElm = {};
      if(elms && elms.snapshotLength > 0) {
        btnElm = elms.snapshotItem(0);
        btnElm.click();
      }
    }, cookieBtnXpath);

    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  if (id) {
    await context.waitForSelector('.product > div > a');
    const pageLink = await context.evaluate(() => { return document.querySelector('.product > div > a').getAttribute('href'); });
    const sku = await context.evaluate(() => document.querySelector('.product > div > a').getAttribute('data-code'));

    if (id.toString() === sku.toString()) {
      console.log('Id: ' + id + '\n SKU: ' + sku);
      await context.goto(pageLink, {
        blockAds: false,
        loadAllResources: true,
        imagesEnabled: true,
        timeout: 100000,
        waitUntil: 'networkidle0',
      });
    }

    try {
      await context.waitForSelector('.onlyPrice', { timeout: 100000 });
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'apotekhjartat',
    domain: 'apotekhjartat.se',
    loadedSelector: '.product img',
    noResultsXPath: '//*[contains(text(),"nga träffar")]',
    zipcode: '',
  },
  implementation,
};
