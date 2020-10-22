
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  const checkExistence = async (selector) => {
    return await context.evaluate(async (sel) => {
      return Boolean(document.querySelector(sel));
    }, selector);
  };

  // Click on load more
  const clickLoadMore = async function (context) {
    let productsCount = 0;
    while (productsCount < 150) {
      productsCount = await context.evaluate(function () {
        const products = document.evaluate('//div[contains(@class,\'product-tile\')]//div[@class=\'product-image\']/img/@src', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return products.snapshotLength;
      });

      // Check if load more exists
      const doesLoadMoreExists = await context.evaluate(function () {
        return Boolean(document.querySelector('button.display-more-products'));
      });

      const optionalWait = async (selector, timeout) => {
        try {
          await context.waitForSelector(selector, { timeout });
          console.log(`Found selector => ${selector}`);
          return true;
        } catch (err) {
          console.log('Couldn\'t load the selector ' + selector);
          return false;
        }
      };

      if (doesLoadMoreExists) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('Clicking on load more btn');
        // @ts-ignore
        await context.click('button.display-more-products');
        await stall(10000);
        await new Promise(resolve => setTimeout(resolve, 3000));

        const captchaSelector = 'iframe[src*="https://geo.captcha"]';
        const isCaptchaFramePresent = await checkExistence(captchaSelector);

        if (isCaptchaFramePresent) {
          try {
            const isHardBlocked = await context.evaluateInFrame(
              captchaSelector,
              function () {
                return document.body.innerText.search('You have been blocked') > -1;
              },
            );
            if (isHardBlocked) {
              console.log('IP is hard blocked');
              return context.reportBlocked(451, 'Blocked!');
              // throw new Error('Blocked');
            }
            await context.evaluateInFrame(
              captchaSelector,
              function () {
                // eslint-disable-next-line
                const code = geetest
                  .toString()
                  .replace(/appendTo\("#([^"]+)"\)/, 'appendTo(document.getElementById("$1"))');
                // eslint-disable-next-line
                return eval(`(${code})()`);
              },
            );

            await new Promise(resolve => setTimeout(resolve, 500));

            const captchaSelectorExist = await optionalWait('.captcha-handler', 30000);
            if (captchaSelectorExist) {
              await context.evaluateInFrame('iframe',
                function () {
                  // @ts-ignore
                  document.querySelector('.captcha-handler').click();
                },
              );
              console.log('Captcha Resolved.');
              await new Promise(resolve => setTimeout(resolve, 500));
              await context.waitForNavigation({ timeout: 30000 });
            } else {
              console.log('Captcha selector did not load');
            }
          } catch (error) {
            console.log('error: NO CAPTCHA ENCOUNTER', error);
            if (error.message === 'Blocked') { return context.reportBlocked(451, 'Blocked! Error - ' + error); }
            // throw error;
          }
        } else {
          console.log('NO CAPTCHA ENCOUNTER');
        }
      } else {
        console.log('load more btn is not present - ' + doesLoadMoreExists);
        break;
      }
    }
  };

  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  await clickLoadMore(context);

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
    country: 'FR',
    store: 'courir',
    domain: 'courir.com',
    url: 'https://www.courir.com/fr/search?q={searchTerms}&lang=fr_FR',
    loadedSelector: '#search-result-items',
    noResultsXPath: 'div[contains(@class,"page-product-search-noresult")]',
  },
  implementation,
};
