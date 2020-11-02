
module.exports = {
  implements: 'navigation/auth/preLogin',
  parameterValues: {
    domain: 'lyreco.it',
    country: 'IT',
    store: 'lyreco',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    try {
      await context.waitForSelector('#_spring_security_remember_me');
    } catch (err) {
      console.log('Keep me logged in button did not load');
    }
    const keepMeLoggedIn = await context.evaluate(() => {
      return Boolean(document.querySelector('#_spring_security_remember_me'));
    });
    if (keepMeLoggedIn) {
      context.click('#_spring_security_remember_me');
    }
  },
};
