/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  { zipcode, keywords },
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
  await dependencies.goto({
    url: destinationUrl,
    zipcode: zipcode,
    firstRequestTimeout: 60000,
    timeout: 60000,
    waitUntil: 'load',
    checkBlocked: false,
    antiCaptchaOptions: {
      type: 'RECAPTCHA',
    },
  });

  // const gotoOptions = {
  //   firstRequestTimeout: 60000,
  //   timeout: 10000,
  //   waitUntil: 'load',
  //   checkBlocked: false,
  //   antiCaptchaOptions: {
  //     type: 'RECAPTCHA',
  //   },
  // };
  // console.log('insite execute.js');
  // const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title])";
  //   const maxRetries = 3;
  //   let numberOfCaptchas = 0;
  //   const timeout =  10000;
  // // try {
  // //     await context.waitForSelector(captchaFrame);
  // //   } catch(e) {
  // //     console.log("Didn't find Captcha.");
  // //   }
  //   const checkExistance = async (selector) => {
  //     return await context.evaluate(async (captchaSelector) => {
  //       return Boolean(document.querySelector(captchaSelector));
  //     }, selector);
  //   };
  //   const checkRedirection = async () => {
  //     const newurl = await context.evaluate(() => window.location.href);
  //     return !newurl.includes(url);
  //   };
  //   async function autoScroll (page) {
  //     await page.evaluate(async () => {
  //       await new Promise((resolve, reject) => {
  //         var totalHeight = 0;
  //         var distance = 100;
  //         var timer = setInterval(() => {
  //           var scrollHeight = document.body.scrollHeight;
  //           window.scrollBy(0, distance);
  //           totalHeight += distance;
  
  //           if (totalHeight >= scrollHeight) {
  //             clearInterval(timer);
  //             resolve();
  //           }
  //         }, 100);
  //       });
  //     });
  //   }
  //   let isCaptchaFramePresent = await checkExistance(captchaFrame);
  //   console.log("isCaptcha:"+ isCaptchaFramePresent);

  //   while (isCaptchaFramePresent && numberOfCaptchas < maxRetries) {
  //     console.log('isCaptcha', true);
  //     ++numberOfCaptchas;
  //     await context.waitForNavigation({ timeout });
  //     try {
  //       console.log(`Trying to solve captcha - count [${numberOfCaptchas}]`);
  //       // @ts-ignore
  //       // eslint-disable-next-line no-undef
  //       await context.evaluateInFrame('iframe', () => grecaptcha.execute());
  //       console.log('solved captcha, waiting for page change');
  //       await context.waitForNavigation({ timeout });
  //       const redirectionSuccess = await checkRedirection();

  //       if (redirectionSuccess) {
  //         console.log('Page was redirected');
  //         await context.goto(url, gotoOptions);
  //         await context.waitForNavigation({ timeout:40000, waitUntil: 'networkidle0' });
  //         await autoScroll(context);
  //         break;
  //       }

  //       isCaptchaFramePresent = await checkExistance(captchaFrame);
  //     } catch (e) {
  //       console.log('Captcha did not load');
  //     }
  //   }  
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'walmart',
    domain: 'walmart.ca',
    url: 'https://www.walmart.ca/recherche?q={searchTerms}',
    loadedSelector: 'div#product-results div[data-automation="product"]',
    noResultsXPath: '//h1[@data-automation="null-results-message"]',
    zipcode: "''",
  },
  implementation,
};
