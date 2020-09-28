
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
    await context.goto('https://www.geetest.com/demo/slide-en.html', {
      antiCaptchaOptions: {
        type: 'GEETEST',
        libPath: captchaLink,
      },
    });
    console.log('Captcha exists, solving captcha');

    await context.solveCaptcha({
      type: 'GEETEST',
      inputElement: '#captcha',
    });
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
