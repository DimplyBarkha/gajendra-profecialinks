
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));

  await dependencies.goto({ url, zipcode: inputs.zipcode });

  try {
    await new Promise((resolve, reject) => setTimeout(resolve, 20000));
  } catch (err) {
    console.log('Error while solving the captcha' + JSON.stringify(err));
  }
  const captchaLink = await context.evaluate(function () {
    const captchaEle = document.evaluate('//iframe[contains(@src,\'geo.captcha\')]/@src', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
    if (captchaEle) {
      return captchaEle.nodeValue;
    }
    return false;
  });

  if (captchaLink) {
    console.log('Captcha exists, calling the geetest API');
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBlockAds(false);
    const responseStatus = await context.goto('https://www.geetest.com/demo/slide-en.html', {
      antiCaptchaOptions: {
        type: 'GEETEST',
        libPath: captchaLink,
      },
      firstRequestTimeout: 60000,
      timeout: 60000,
      waitUntil: 'load',
      checkBlocked: false,
    });
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);
    console.log('Captcha exists, solving captcha');
    await context.waitForNavigation({ timeout: 30000 });
    // await context.solveCaptcha({
    //   type: 'GEETEST',
    //   inputElement: '#captcha',
    // });
    await context.evaluateInFrame('iframe',
      function () {
        const code = geetest
          .toString()
          .replace(
            /appendTo\("#([^"]+)"\)/,
            'appendTo(document.getElementById("$1"))',
          );
        return eval(`(${code})('/captcha/geetest');`);
      },
    );
    await new Promise(resolve => setTimeout(resolve, 500));
    await context.evaluateInFrame('iframe',
      function () {
        // @ts-ignore
        document.querySelector('.captcha-handler').click();
      },
    );
    await new Promise(resolve => setTimeout(resolve, 60000));
    await dependencies.goto({ url, zipcode: inputs.zipcode });
  }

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
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
    loadedSelector: 'ul.search-result-items',
    noResultsXPath: 'div.page-product-search-noresult',
  },
  implementation,
};
