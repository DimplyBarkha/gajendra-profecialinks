
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'totalwine.com',
    timeout: 45000,
    jsonToTable: null,
    country: 'US',
    store: 'totalwine',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    url = url + '#[!opt!]{"cookie_jar":[{"name":"twm-userStoreInformation","value":"ispStore~402:ifcStore~null@ifcStoreState~US-MD@method~INSTORE_PICKUP"}]}[/!opt!]'
    await context.goto(url, { first_request_timeout: 660000, timeout: 65000, waitUntil: 'load', anti_fingerprint: true, checkBlocked: false });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    
    // await context.stop();
    // await context.goto('https://www.totalwine.com/', { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    // await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    // console.log(zipcode);
    // if (zipcode) {
    //   await dependencies.setZipCode({ url, zipcode });
    // }
  },
};
