module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: '180smoke.ca',
    timeout: null,
    country: 'CA',
    store: '180smoke',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { timeout = 100000 } = parameters;
    const { url, zipcode, storeId } = inputs;
    let pageUrl = url;
    if (url.includes('search')) {
      if (inputs.keywords.toLowerCase() === 'juul') {
        pageUrl = url + '&manufacturer=1823';
      } else if (inputs.keywords.toLowerCase() === 'smok') {
        pageUrl = url + '&manufacturer=670';
      }
    }
    await context.goto(pageUrl, {
      timeout,
      waitUntil: 'load',
      checkBlocked: true,
      captureRequests: true,
    });

    // patch for synchronicity issue between json decoring and goto result
    if (
      url.split('[!opt!]')[1] &&
      url.split('[!opt!]')[1].includes('"type":"json"')
    ) {
      await new Promise(resolve => setTimeout(resolve, 50000));
    }

    console.log(`zipcode: ${zipcode}`);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  },
};
