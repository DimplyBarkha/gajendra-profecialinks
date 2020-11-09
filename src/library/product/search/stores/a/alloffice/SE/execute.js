async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  const responseStatus = await context.goto(url, {
<<<<<<< HEAD
    firstRequestTimeout: 60000,
=======
>>>>>>> b1a430b0163219b10fd0ea427eb83e46ba63a41c
    timeout: 50000,
    waitUntil: 'load',
    checkBlocked: false,
  });

  console.log('Status :', responseStatus.status);
  console.log('URL :', responseStatus.url);

<<<<<<< HEAD
  // Check if accept cookies dialog pops up
  /*const doesAcceptCookiesBtnExists = await context.evaluate(function () {if(document.evaluate(`//button[contains(.,'Jag godkänner')]`, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext()) {
    document.evaluate(`//button[contains(.,'Jag godkänner')]`, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().click()
    }
  });

  if (doesAcceptCookiesBtnExists) {
    console.log('Clicking on accept cookies btn');
    await context.click(`//button[contains(.,'Jag godkänner')]`);
    await context.waitForNavigation();
  }*/
  await context.evaluate(function () {if(document.evaluate(`//button[contains(.,'Jag godkänner')]`, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext()) {
    document.evaluate(`//button[contains(.,'Jag godkänner')]`, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().click()
    }
  });
 
  

=======
>>>>>>> b1a430b0163219b10fd0ea427eb83e46ba63a41c
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 50000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  // Apply scroll
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        const products = document.evaluate('//div[@id="content-container"]//img/@src', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const productsCount = products.snapshotLength;
        console.log('Length: ' + productsCount);
<<<<<<< HEAD
        await stall(5000);
        scrollTop += 500;
=======
        await stall(1000);
        scrollTop += 1000;
>>>>>>> b1a430b0163219b10fd0ea427eb83e46ba63a41c
        window.scroll(0, scrollTop);
        if (scrollTop === 20000 || productsCount > 160) {
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
    country: 'SE',
    store: 'alloffice',
    domain: 'alloffice.se',
    url: 'https://www.alloffice.se/sok?q={searchTerms}&count=150',
    loadedSelector: 'a[data-test-id="product-link"]',
    noResultsXPath: '//div[contains(.,"sökning gav inga träffar")]',
    zipcode: '',
  },
  implementation,
};