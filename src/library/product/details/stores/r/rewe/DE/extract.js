
const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  if (inputs.id) {
    await context.evaluate(async function () {
      const optionalWait = async (sel) => {
        try {
          await context.waitForSelector(sel, { timeout: 60000 });
        } catch (err) {
          console.log(`Couldn't load selector => ${sel}`);
        }
      };
      const noResultsSelector = document.querySelector('span.search-service-rsZeroResultsSearchTerm');
      if (noResultsSelector) {
        throw new Error('No results for this RPC');
      }
      let isCookieSelector = document.querySelector('button[id="uc-btn-accept-banner"]');
      if (isCookieSelector) {
        isCookieSelector.click();
      }
      const isSelector = document.querySelector('div.search-service-rsTilesDefault > div.search-service-product:first-child div.search-service-productDetailsWrapper a');
      if (isSelector) {
        try {
          isSelector.click();
          // await context.waitForNavigation({ timeout: 60000, waitUntil: 'load' });
          // await context.waitForNavigation({ timeout: 60000, waitUntil: 'load' });
          optionalWait('h1.pdr-QuickInfo__heading');
        } catch (err) {
          console.log('Not clicked' + err);
        }
      }
    });
  }
  // if (inputs.id) {
  //   await context.evaluate(async function () {
  //     const isSelector = document.querySelector('div.search-service-rsTilesDefault > div.search-service-product:first-child div.search-service-productDetailsWrapper a');
  //     if (isSelector) {
  //       isSelector.click();
  //     }
  //   });
  // }
  await context.evaluate(async function () {
    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 60000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    let isCookieSelector = document.querySelector('button[id="uc-btn-accept-banner"]');
    if (isCookieSelector) {
      isCookieSelector.click();
    }
    optionalWait('h1.pdr-QuickInfo__heading');
    const isFound = document.evaluate('//span[contains(@class,"articleNumber")]/text()[2]', document).iterateNext();
    if (isFound) {
      const response = await fetch(`https://shop.rewe.de/api/product-group?productId=${isFound.textContent}`);
      if (response.status !== 404) {
        var json = await response.json();
        console.log(json.group.groupList);
        const varInfoIds = [];
        const varInfo = [];
        varInfoIds.push(json.group.groupList.map((ele) => ele.productId));
        varInfo.push(json.group.groupList.map((ele) => ele.discriminatorValue));
        document.querySelector('h1.pdr-QuickInfo__heading').setAttribute('productId', varInfoIds);
        document.querySelector('h1.pdr-QuickInfo__heading').setAttribute('varInfo', varInfo);
      } else {
        console.log('404');
      }
    }
    const gtinSelector = document.evaluate('//script[@type="application/ld+json"][contains(.,"gtin")]', document).iterateNext();
    if (gtinSelector) {
      const gtin = gtinSelector.textContent.split('gtin13":"')[1].split('",')[0];
      document.querySelector('h1.pdr-QuickInfo__heading').setAttribute('gtin', gtin);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'rewe',
    transform,
    domain: 'shop.rewe.de',
    zipcode: '',
  },
  implementation,
};
