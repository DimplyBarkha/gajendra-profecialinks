
module.exports = {
  implements: 'navigation/auth/postLogin',
  parameterValues: {
    domain: 'shoplink.ie',
    country: 'IE',
    store: 'shoplink',
    zipcode: "''",
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    let isHomePage = false;
    try {
      await context.waitForSelector('#department_select li');
    } catch (err) {
      console.log('Home page loaded');
      isHomePage = true;
    }
    if (isHomePage) {
      console.log('Go to the listing page');
      await context.goto('http://www.shoplink.ie/');
    }
  },
};
