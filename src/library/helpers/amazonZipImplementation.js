
const implementation = async (inputs, parameters, context, dependencies) => {
  const { zipcode, url } = inputs;

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

  const onCorrectZip = await context.evaluate((zipcode) => {
    const zipText = document.querySelector('div#glow-ingress-block');
    return zipText.textContent.includes(zipcode);
  }, zipcode);

  if (!onCorrectZip) {
    if (!apiZipChange) {
      await amazonHelp.setLocale(zipcode);
      await context.evaluate((zipcode) => {
        const zipText = document.querySelector('div#glow-ingress-block');
        if (!zipText.textContent.includes(zipcode)) {
          throw new Error('API and manual Zip change failed');
        }
      }, zipcode);
    } else {
      await context.goto(url, {
        timeout: 20000,
        waitUntil: 'load',
        checkBlocked: false,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
    }
  }
};

module.exports = {
  implementation,
};
