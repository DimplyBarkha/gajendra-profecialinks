async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { url, id } = inputs;

  const gotoOptions = {
    timeout: 30000,
    waitUntil: 'load',
    checkBlocked: true,
    block_ads: false,
    load_all_resources: true,
    images_enabled: true,
    // cookies
  };

  if (!url) {
    const homeUrl = 'https://www.auchandrive.fr';
    const newUrl = 'https://www.auchandrive.fr/catalog/-' + inputs.id;
    await setZipCodeAndStore(homeUrl);
    await context.goto(newUrl, gotoOptions);
  } else {
    const homeUrl = 'https://www.auchandrive.fr';
    await setZipCodeAndStore(homeUrl);
    await context.goto(url, gotoOptions);
  }

  async function setZipCodeAndStore (homeUrl) {
    await context.goto(homeUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    await context.waitForSelector('input[name="address"]');
    await context.setInputValue('input[name="address"]', '13400');
    await context.click('button#update');
    await context.waitForSelector('div.storelocator__pos--container');
    await context.click('a[data-store-id="874"]');
  }
  // TODO: Check for not found?
}

module.exports = {
  parameterValues: {
    country: 'FR',
    store: 'auchandrive',
    domain: 'auchandrive.fr',
  },
  implementation,
};
