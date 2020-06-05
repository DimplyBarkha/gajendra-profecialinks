async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { url, id } = inputs;
  const cookies = [
    { name: "gtm_store_info", value: "ALLAR SERVICES EDF|98731" },
    { name: "auchanCook", value: "98731|" }
  ];

  const gotoOptions = {
    timeout: 10000,
    waitUntil: 'load',
    checkBlocked: true,
    cookies
  };

  // // Need to load the webpage first to start a session
  await context.goto('https://www.auchandrive.fr/recherche/');
  await context.setCookie(...cookies);

  if (id) {
    const newUrl = 'https://www.auchandrive.fr/recherche/' + id;
    await context.goto(newUrl, gotoOptions);
    return await context.clickAndWaitForNavigation('a.product-item__main', undefined, { waitUntil: 'networkidle0' });
  }

  await context.goto(url, gotoOptions);

  // TODO: Check for not found?
}

module.exports = {
  parameterValues: {
    country: 'FR',
    store: 'auchandrive',
    domain: 'auchandrive.fr',
  },
  implementation
};
