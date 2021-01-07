
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    domain: 'debijenkorf.nl',
    loadedSelector: 'div.dbk-productdetail__container',
    noResultsXPath: '//div[contains(@class, "div.dbk-search-empty")]',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const searchUrl = `https://ceres-catalog.debijenkorf.nl/catalog/product/show?productVariantCode=${inputs.id}&cached=false&locale=nl_NL&api-version=2.34`;
    try {
      await context.goto(searchUrl, {
        timeout: 30000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
    } catch (e) {
      console.log(e);
    }

    const productDetailsLink = await context.evaluate(function () {
      let url = null;
      let htmlContent = document.querySelector('pre').textContent;
      if (htmlContent) {
        htmlContent = JSON.parse(htmlContent);
        if (htmlContent.data && htmlContent.data.product && htmlContent.data.product.currentVariantProduct) {
          console.log(htmlContent.data.product.currentVariantProduct.url);
          url = htmlContent.data.product.currentVariantProduct.url;
          return url;
        } else if (htmlContent.data && htmlContent.data.product) {
          console.log(htmlContent.data && htmlContent.data.product.url);
          url = htmlContent.data && htmlContent.data.product.url;
        }
      }
      return url;
    });
    console.log("product url", productDetailsLink);
    if (productDetailsLink) {
      const url = productDetailsLink;
      await context.goto(url, {
        timeout: 30000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
    } else {
      return false;
    }
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, parameters.noResultsXPath);
  },
};
