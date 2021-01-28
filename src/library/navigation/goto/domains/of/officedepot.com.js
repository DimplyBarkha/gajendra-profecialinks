
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'officedepot.com',
    timeout: 1000000,
    country: 'US',
    store: 'officedepot',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain }, context, dependencies) => {
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: false });
    const elem = await context.evaluate(function () {
      return Boolean(document.querySelector('main > h1'));
    });
    if(elem){
      return context.reportBlocked(404, 'Blocked!');
    }
  }
};
