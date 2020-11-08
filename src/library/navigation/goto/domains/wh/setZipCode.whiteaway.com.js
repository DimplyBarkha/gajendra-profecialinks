async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { url, zipcode } = inputs;
  console.log('Zip' + zipcode);
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
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

  const doesPriceExists = async function (xpath) {
    const price = await context.evaluate(function (xp) {
      const element = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      console.log('Element' + element);
      const text = element ? element.textContent : null;
      return text;
    }, xpath);
    return price;
  };

  const priceSelector = url.includes('searchTerm') ? '//div[@class="campaign-banner__info offer"]/div[2]/span | //span[@class="price-section__price"]' : '//span[@class="price-section__price"]';
  const applyScrollToPage = !url.includes('searchTerm');
  const price = await doesPriceExists(priceSelector);
  if (price) {
    console.log('price is available, do not load store page');
    if (applyScrollToPage) {
      await applyScroll(context);
    }
    
    return;
  }

  const NEAREST_STORE_URL = zipcode === '1360' ? 'https://www.whiteaway.com/store/MA-Hadley/1916' : 'https://www.lowes.com/store/CA-Burbank/1144';
  await context.goto(NEAREST_STORE_URL, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

  const shopButtonEle = await context.evaluate(function () {
    return !!document.evaluate('//button[contains(.,\'SHOP THIS STORE\')]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });

  if (shopButtonEle) {
    await context.click('header > button');
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
  }
  console.log('params', parameters);
  await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  if (applyScrollToPage) {
    await applyScroll(context);9
  }
}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'DK',
    domain: 'whiteaway.com',
    store: 'whiteaway',
  },
  implementation,
};
