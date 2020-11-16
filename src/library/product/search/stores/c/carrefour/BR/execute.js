async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  //   try {
  //     await context.waitForSelector('div[class*="galleryItem"]', { timeout: 50000 });
  //     console.log('rowxpath loaded successfully');
  //   } catch (e) {
  //     console.log('rowxpath did not load at all');
  //   }
  //   try {
  //     await context.waitForSelector('button[id="onetrust-accept-btn-handler"]', { timeout: 30000 });
  //     console.log('selector loaded successfully');
  //   } catch (e) {
  //     console.log('selector did not load at all');
  //   }
  //   await context.evaluate(() => {
  //     const button = document.querySelector('button[id="onetrust-accept-btn-handler"]');
  //     if (button) {
  //       button.click();
  //       console.log('button is clicked successfully');
  //     }
  //   })
  //   console.log('params', parameters);
  //   const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  //   await dependencies.goto({ url, zipcode: inputs.zipcode });
  //   const addOptionalWait = async (selector) => {
  //     try {
  //       await context.waitForSelector(selector, { timeout: 30000 })
  //       console.log(`${selector}-- loaded successfully`)
  //     } catch (e) {
  //       console.log(`${selector}-- did not load at all`)
  //     }
  //   }
  //   const checkExistance = async (selector) => {
  //     return await context.evaluate(async (selector) => {
  //       return await Boolean(document.querySelector(selector))
  //     }, selector)
  //   }
  //   const cookieSelector = 'button[id="onetrust-accept-btn-handler"]';
  //   addOptionalWait(cookieSelector);
  //   const cookie = await checkExistance(cookieSelector);
  //   console.log(`this is what is returned ${cookie}`);
  //   if (cookie) {
  //     await context.evaluate(() => {
  //       const button = document.querySelector('button[id="onetrust-accept-btn-handler"]');
  //       button.click();
  //     })
  //     console.log('cookie clicked successfully');
  //     await new Promise((res) => setTimeout(res, 10000));
  //   }
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 50000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  await context.evaluate(async () => {
    const button = document.querySelector('button[id="onetrust-accept-btn-handler"]');
    if (button) {
      // @ts-ignore
      button.click();
      console.log(`cookie button clicked succesfully`)
      await new Promise((res) => setTimeout(res, 10000));
    } else {
      console.log(`not able to click the cookies button`);
    }
  })
  // written code for custom pagination to solve the product repeatation issue
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1500);
        scrollTop += 1000;
        console.log(`this is the current scrollTop ---- ${scrollTop}`);
        window.scroll(0, scrollTop);
        const searchUrl = window.location.href;
        const appendElements = document.querySelectorAll('div[class*="galleryItem"]');
        if (appendElements.length) {
          appendElements.forEach((element) => {
            if (element.getAttribute('searchurl') == null) {
              element.setAttribute('searchurl', searchUrl);
            }
          });
        }
        try {
          await context.waitForSelector('div[class*="imageContainer"] > img', { timeout: 50000 });
          console.log('Image loaded successfully');
        } catch (e) {
          console.log('can not load the image');
        }
        const totalProductOnPage = document.querySelectorAll('div[class*="galleryItem"]');
        console.log('total product on the page is this number ->', totalProductOnPage.length);
        if (scrollTop > 20000 || totalProductOnPage.length >= 150) {
          console.log('here the loop is going to break');
          await stall(1500);
          break;
        }
        const clickButton = document.querySelector('a[rel="next"]');
        if (clickButton) {
          // @ts-ignore
          clickButton.click();
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  await context.evaluate(() => {
    const searchUrl = window.location.href;
    const appendElements = document.querySelectorAll('div[class*="galleryItem"]');
    if (appendElements.length) {
      appendElements.forEach((element) => {
        if (element.getAttribute('searchurl') == null) {
          element.setAttribute('searchurl', searchUrl);
        }
      });
    }
  })
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
    country: 'BR',
    store: 'carrefour',
    domain: 'carrefour.com.br',
    url: 'https://mercado.carrefour.com.br/busca/{searchTerms}',
    loadedSelector: 'div[class*="imageContainer"]>img',
    noResultsXPath: '//div[contains(@class,"layout")]/div[contains(@class,"searchNotFound")]',
    zipcode: '',
  },
  implementation,
};
