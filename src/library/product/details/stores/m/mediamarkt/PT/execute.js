async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  var url = '';
  // if (inputs.id) {
  //   url = `https://www.falabella.com.ar/falabella-ar/product/${inputs.id}`;
  // } else {
  url = inputs.URL || inputs.url;
  // }
  await context.goto(url, {
    timeout: 100000,
    waitUntil: 'networkidle0',
    checkBlocked: true,
    js_enabled: true,
    css_enabled: false,
    random_move_mouse: true,
  });

  return await context.waitForNavigation({ waitUntil: 'networkidle0' });

  // return await context.evaluate(function (xp) {
  //   const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  //   return !r;
  // }, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PT',
    store: 'mediamarkt',
    domain: 'mediamarkt.pt',
    loadedSelector: null,
    noResultsXPath: "//div[@class='page-404']",
    zipcode: '',
  },
  implementation,
};
