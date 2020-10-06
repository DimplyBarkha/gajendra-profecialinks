
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bedbathandbeyond.com',
    timeout: 60000,
    country: 'US',
    store: 'bedBathBeyond',
    zipcode: '',
  },
  implementation: async ({ url }, { timeout }, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"load_timeout":60,"load_all_resources":true,"cookie_jar":[{"name":"BedBathUS1ntsh1","value":"US:USD"}]}[/!opt!]`;
    timeout = timeout || 10000;
    await context.setBypassCSP(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setFirstRequestTimeout(60000);
    const response = await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
    const errorPage = await context.evaluate(() => {
      if (document.body.innerText.trim().length === 0 || document.querySelector('#ctl00_InvalidRequest')) {
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
