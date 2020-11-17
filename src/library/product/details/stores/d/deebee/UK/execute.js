async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.goto(`https://www.deebee.co.uk/product/id/${inputs.id}`, {
    timeout: 100000,
    waitUntil: 'load',
    checkBlocked: true,
    js_enabled: true,
    css_enabled: false,
    random_move_mouse: true,
  });
  const userCompany = await context.evaluate(function () {
    return document.querySelector('span#user-company').innerText;
  });
  // console.log('userCompany', userCompany);
  if (userCompany.indexOf('SUPPLIER') === -1) {
    await context.goto('https://www.deebee.co.uk/account/logon', {
      timeout: 100000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.waitForNavigation({ waitUntil: 'load' });

    await context.setInputValue('#custname', 'S00001');
    await context.setInputValue('#custpass', 'supplier');

    // document.querySelector('div.login-details input.input-login').click();
    await context.click('form[action="https://www.deebee.co.uk/account/logon"] button[type="submit"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.goto(`https://www.deebee.co.uk/product/id/${inputs.id}`, {
      timeout: 100000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
  }
  await context.waitForNavigation({ waitUntil: 'load' });

  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    return !r;
  }, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'deebee',
    domain: 'deebee.co.uk',
    loadedSelector: 'img[itemprop="image"]',
    noResultsXPath: "//div[contains(@class, 'alert-warning')]//strong[contains(text(), 'This product is not available')]",
    zipcode: '',
  },
  implementation
};
