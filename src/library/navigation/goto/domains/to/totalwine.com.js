
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
    try {
      const response = await context.goto(url, { timeout: 60000, waitUntil: 'networkidle0', checkBlocked: false });
      console.log('Response ' + JSON.stringify(response));
      if (response.message && response.message.includes('code 403')) {
        console.log('Response failed');
        return context.reportBlocked(451, 'Blocked!');
      }
    } catch (err) {
      console.log('Error response' + JSON.stringify(err));
      if (err.message && err.message.includes('code 403')) {
        console.log('403 Response');
        return context.reportBlocked(451, 'Blocked!');
      }
      throw err;
    }
  },
};
