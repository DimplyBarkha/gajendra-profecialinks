
const implementation = async (inputs, parameters, context, dependencies) => {
  const { zipcode } = inputs;

  await context.evaluate(async (zipcode) => {
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
    if (response.status !== 200) {
      throw new Error('Zipcode change failed');
    } else {
      window.location.reload();
    }
  }, zipcode);
};

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'amazon.com',
    store: 'amazonFresh',
    zipcode: '',
  },
  implementation,
};
