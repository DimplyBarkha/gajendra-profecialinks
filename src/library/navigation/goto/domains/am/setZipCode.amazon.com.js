
const implementation = async (inputs, parameters, context, dependencies) => {
  const { zipcode } = inputs;

  const apiZipChange = await context.evaluate(async (zipcode) => {
    const body = `locationType=LOCATION_INPUT&zipCode=${zipcode}&storeContext=generic&deviceType=web&pageType=Gateway&actionSource=glow&almBrandId=undefined`;

    const response = await fetch('/gp/delivery/ajax/address-change.html', {
      headers: {
        accept: 'text/html,*/*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest',
      },
      body,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    return response.status === 200;
  }, zipcode);

  const { Helpers: { Helpers }, AmazonHelp: { AmazonHelp } } = dependencies;
  const helpers = new Helpers(context);
  const amazonHelp = new AmazonHelp(context, helpers);

  if (!apiZipChange) {
    await amazonHelp.setLocale(zipcode);
    await context.evaluate((zipcode) => {
      const zipText = document.querySelector('div#glow-ingress-block');
      if (!zipText.textContent.includes(zipcode)) {
        throw new Error('API and manual Zip change failed');
      }
    }, zipcode);
  } else {
    await context.evaluate(() => {
      window.location.reload();
    });
  }
};

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'amazon.com',
    store: 'amazon',
    zipcode: '10001',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
