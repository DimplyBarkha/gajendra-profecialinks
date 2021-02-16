module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'drizly',
    transform: null,
    domain: 'drizly.com',
    zipcode: '',
    storeaddress: '',
    storecity: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { url, zipcode, storecity, storeaddress } = inputs;
    if (url) {
      const addressText = zipcode + ' ' + storeaddress + ' ' + storecity;
      console.log(addressText);

      await context.waitForSelector('div[class^="ProductMetaInformation__VariantSelectorDesktopContainer"] span[class="MuiButton-label"]');
      await context.click('div[class^="ProductMetaInformation__VariantSelectorDesktopContainer"] span[class="MuiButton-label"]');
      console.log('Searching for adding input');
      if (await context.waitForSelector('input[type="search"]')) {
        await context.waitForSelector('input[type="search"]');
        console.log('Found search for adding input');
      }
      await context.evaluate(async function (addressText, zipcode) {
        document.head.setAttribute('zipcode', zipcode);
        if (document.querySelector('input[placeholder="Enter address to shop"]')) {
          document.querySelector('input[placeholder="Enter address to shop"]').remove();
          const setVal = document.querySelector('input[placeholder="Enter address to shop"]');
          setVal.value = addressText;
          console.log('Set Value address');
          let elem = document.querySelector('[name="addressSearch"]');
          elem.value = addressText;
          let event = new Event('focus');
          elem.dispatchEvent(event);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          if (document.querySelector('div.pac-item')) {
            elem = document.querySelector('span.pac-item-query');
            elem.dispatchEvent(event);
            event = new Event('click');
            elem.dispatchEvent(event);
            document.querySelector('span.pac-item-query').click();
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
          // document.querySelector('div.pac-item').click();
          // await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        if (document.querySelector('div[class^="RadioVariantSelector__ButtonContainer"] span.MuiButton-label')) {
          document.querySelector('div[class^="RadioVariantSelector__ButtonContainer"] span.MuiButton-label').remove();
          const checkAvailability = document.querySelector('div[class^="RadioVariantSelector__ButtonContainer"] span.MuiButton-label');
          checkAvailability.click();
        }
      }, addressText, zipcode);
    }
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
  },
};
