
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bedbathandbeyond.ca',
    timeout: 120000,
    country: 'CA',
    store: 'bedBathBeyond',
    zipcode: '',
  },
  implementation: async ({ url }, { timeout }, context, dependencies) => {
    // url = `${url}#[!opt!]{"force200": true}[/!opt!]`;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.captureRequests();
    // await context.setUseRelayProxy(false);
    const response = await context.goto(url, { timeout: timeout, waitUntil: 'load' });
    const errorPage = await context.evaluate(() => {
      if ((document.body && document.body.innerText.length === 0) || document.querySelector('#ctl00_InvalidRequest') || document.title === 'Bed Bath & Beyond Canada GEO Error Page') {
        return true;
      }
      return false;
    });
    if (errorPage) { return context.reportBlocked((response.code || response.status || 0), 'Blocked: error page'); }

    try {
      await context.waitForSelector('#footer,footer');
      console.log('footer to scroll to is loaded');
    } catch(err) {
      console.log('got some error while waiting for the footer', err.message);
      try {
        await context.waitForSelector('#footer,footer');
        console.log('footer to scroll to is loaded');
      } catch(error) {
        console.log('got some error while waiting for the footer, again', error.message);
      }
    }

    if (url.match(/store\/product/)) {
      await context.evaluate(() => {
        try {
          document.querySelector('#footer,footer').scrollIntoView({
            behavior: 'smooth',
          });
        } catch(err) {
          console.log('got some error while scrolling!');
        }
        
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
