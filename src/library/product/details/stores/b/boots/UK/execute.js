async function implementation (
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
  await context.click('.product_name_link');
  await new Promise((resolve, reject) => setTimeout(resolve, 50000));
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    domain: 'boots.com',
    loadedSelector: 'div#estore_product_title',
    noResultsXPath: '/html[not(//meta[@name="pageName"][@content="ProductPage"])] | //span[contains(text(),"This product has either been removed or is no longer available for sale.")]',
    // noResultsXPath: '//div[@class="no-result"]//div[@class="results_none_description"]',
    zipcode: '',
  },
};
