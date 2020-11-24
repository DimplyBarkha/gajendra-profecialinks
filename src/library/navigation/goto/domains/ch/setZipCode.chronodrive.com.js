async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { url, zipcode } = inputs;
  try {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.waitForSelector('input[id="searchField"]');
    await context.setInputValue('input[id="searchField"]', zipcode);
    await context.click('a[id="btnSearch"]');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.waitForSelector('#resultZone');
    await context.click('#resultZone > div > ul > li:nth-child(1) > div.actions-btn > a:nth-child(2)');
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (e) {
    console.log('Error: ', e);
  }
  await context.waitForNavigation();
  await context.goto(url, { first_request_timeout: 60000, waitUntil: 'load', checkBlocked: true });
}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'FR',
    domain: 'chronodrive.com',
    store: 'Chronodrive',
    zipcode: '91160',
  },
  implementation,
};
