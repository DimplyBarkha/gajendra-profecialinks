async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.goto(`https://www.boots.com/sitesearch?searchTerm=${inputs.id}`, {
    timeout: 100000,
    waitUntil: 'load',
    checkBlocked: true,
    js_enabled: true,
    css_enabled: false,
    random_move_mouse: true,
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  await context.waitForNavigation({ waitUntil: 'load' });
  // document.querySelector('div.login-details input.input-login').click();
  await context.click('div.product_name a');
  await new Promise((resolve, reject) => setTimeout(resolve, 50000));
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    return !r;
  }, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    domain: 'boots.com',
    loadedSelector: 'canvas',
    noResultsXPath: '/html[not(//meta[@name="pageName"][@content="ProductPage"])] | //span[contains(text(),"This product has either been removed or is no longer available for sale.")]',
    zipcode: '',
  },
  implementation,
};
