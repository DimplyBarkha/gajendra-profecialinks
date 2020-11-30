async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  // const { transform } = parameters;
  const { variants } = dependencies;
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
      const isCookieSelector = document.querySelector('button[id="uc-btn-accept-banner"]');
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

  await context.evaluate(async function () {
    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 60000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    const isCookieSelector = document.querySelector('button[id="uc-btn-accept-banner"]');
    if (isCookieSelector) {
      isCookieSelector.click();
    }
    optionalWait('h1.pdr-QuickInfo__heading');
    const isFound = document.evaluate('//span[contains(@class,"articleNumber")]/text()[2]', document).iterateNext();
    if (isFound) {
      const rpc = isFound.textContent;
      console.log(`Mamatha ${rpc}`);
      var response = await fetch(`https://shop.rewe.de/api/product-group?productId=${rpc}`);
      console.log(`https://shop.rewe.de/api/product-group?productId=${rpc}`);
      if (response.status !== 404) {
        var json = await response.json();
        console.log(json.group.groupList);
        for (let i = 0; i < json.group.groupList.length; i++) {
          const newDiv = document.createElement('div');
          newDiv.id = 'variants';
          newDiv.setAttribute('productId', json.group.groupList[i].productId);
          newDiv.setAttribute('productUrl', `https://shop.rewe.de${json.group.groupList[i].canonicalPath}`);
          document.querySelector('h1.pdr-QuickInfo__heading').append(newDiv);
        }
      } else {
        console.log('404');
        const newDiv = document.createElement('div');
        newDiv.id = 'variants';
        newDiv.setAttribute('productId', document.evaluate('//span[contains(@class,"articleNumber")]/text()[2]', document).iterateNext().textContent);
        newDiv.setAttribute('productUrl', document.querySelector('link[rel="canonical"]').getAttribute('href'));
        document.querySelector('h1.pdr-QuickInfo__heading').append(newDiv);
      }
    }
  });
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'rewe',
    transform: null,
    domain: 'shop.rewe.de',
    zipcode: '',
  },
  implementation,
};
