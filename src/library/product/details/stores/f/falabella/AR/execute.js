async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  var url = '';
  if (inputs.id) {
    url = `https://www.falabella.com.ar/falabella-ar/product/${inputs.id}`;
  } else {
    url = inputs.URL || inputs.url;
  }
  await context.goto(url, {
    timeout: 100000,
    waitUntil: 'load',
    checkBlocked: true,
    js_enabled: true,
    css_enabled: false,
    random_move_mouse: true,
  });

  await context.waitForNavigation({ waitUntil: 'load' });

  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    return true;
    // console.log('r', r,data);
    // return !r;
  }, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AR',
    store: 'falabella',
    domain: 'falabella.com.ar',
    loadedSelector: 'div.imageGallery img',
    noResultsXPath: "//div[contains(@class, 'no-result')]",
    zipcode: '',
  },
  implementation,
};
