
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'salonservices.com',
    timeout: null,
    country: 'UK',
    store: 'salonservices',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    console.log(inputs);
    if (inputs.url.includes('https://salonservices.com/')) {
      const id = inputs.url.replace('https://salonservices.com/', '');
      console.log(id);
      inputs.url = '';
      if (id.length === 4) {
        inputs.url = `https://www.salon-services.com/00${id}.html`;
        console.log(inputs.url);
      } else if (id.length === 5) {
        inputs.url = `https://www.salon-services.com/0${id}.html`;
        console.log(inputs.url);
      } else if (id) {
        inputs.url = `https://www.salon-services.com/${id}.html`;
        console.log(inputs.url);
      }
    }
    const url = inputs.url;
    console.log(url);
    try {
      const response = await context.goto(url, { timeout: 30000, waitUntil: 'networkidle0', checkBlocked: true });
      console.log('Response ' + JSON.stringify(response));
    } catch (err) {
      console.log('Error response' + JSON.stringify(err));
      if (err.message && err.message.includes('410')) {
        console.log('410 Response');
        return context.reportBlocked(410, 'Product doesn"t exist');
      }
      throw err;
    }

    await context.waitForNavigation();
  },
};
