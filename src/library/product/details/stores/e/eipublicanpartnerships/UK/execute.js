async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.goto('https://www.eipublicanpartnerships.com/pages/register.aspx', {
    timeout: 100000,
    waitUntil: 'load',
    checkBlocked: true,
    js_enabled: true,
    css_enabled: false,
    random_move_mouse: true,
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  await context.waitForNavigation({ waitUntil: 'load' });

  await context.evaluate(async function () {
    document.querySelector('div.login-details input.input-username').value = 'demoaccount5@eigroupplc.com';
    document.querySelector('div.login-details input.input-password').value = 'EIGd3mo!';
  });

  // document.querySelector('div.login-details input.input-login').click();
  await context.click('div.login-details input.input-login');
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  await context.click('a.link--no-underline');
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  await context.goto(`https://ordering.eipublicanpartnerships.com/products/kw/${inputs.id}`, {
    timeout: 100000,
    waitUntil: 'load',
    checkBlocked: true,
    js_enabled: true,
    css_enabled: false,
    random_move_mouse: true,
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  await context.click('span.title a');
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
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
    store: 'eipublicanpartnerships',
    domain: 'eipublicanpartnerships.com',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
