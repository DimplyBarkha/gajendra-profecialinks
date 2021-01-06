
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bedbathandbeyond.com',
    timeout: 120000,
    country: 'US',
    store: 'bedBathBeyond',
    zipcode: '',
  },
  implementation: async ({ url }, { timeout }, context, dependencies) => {
    url = `${url}#[!opt!]{"force200": true}[/!opt!]`;
    const response = await context.goto(url);
    const errorPage = await context.evaluate(() => {
      if ((document.body && document.body.innerText.length === 0) || document.querySelector('#ctl00_InvalidRequest')) {
        return true;
      }
      return false;
    });
    if (errorPage) { return context.reportBlocked((response.code || response.status || 0), 'Blocked: error page'); }

    if (url.match(/store\/product/)) {
      await context.evaluate(() => {
        document.querySelector('#footer,footer').scrollIntoView({
          behavior: 'smooth',
        });
      });
      await context.waitForNavigation({ waitUntil: 'networkidle0' });
      try {
        await context.waitForSelector('#wc-aplus');
      } catch (err) {
        console.log('No enhanced content or did not load enhance content.');
      }
    }
    await context.evaluate(() => {
      document.body.setAttribute('current-page', window.location.href);
    });
  },
};
