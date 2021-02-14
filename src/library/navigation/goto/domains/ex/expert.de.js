
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'expert.de',
    timeout: 35000,
    country: 'DE',
    store: 'expert',
  },
  implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
    let location = '';
    if (zipcode === 'ahlen') {
      location = '/ahlen';
    } else if (zipcode === 'saarwellingen') {
      location = '/saarwellingen';
    } else if (zipcode === 'lorrach') {
      location = '/loerrach';
    } else if (zipcode === 'nurnberg') {
      location = '/nuernberg1';
    } else if (zipcode === 'mannheim') {
      location = '/mannheim1';
    }

    if (zipcode) { // if we have zipcode, goto specific location to set zipcode on website
      console.log('Zipcode passed => ', zipcode);
      // await context.setBlockAds(false);
      const _url = `https://www.expert.de${location}`;
      console.log('GOTO Url to set zipcode => ', _url);
      await context.goto(_url, {
        block_ads: false,
        anti_fingerprint: true,
        discard_CSP_header: false,
        timeout: 300000,
        waitUntil: 'load',
      });

      if (zipcode && zipcode.length) {
        // const zipcodeHref = document.querySelector('a[class^="widget-ExpertLogo--link"]') ? document.querySelector('a[class^="widget-ExpertLogo--link"]').getAttribute('href') : '';
        await context.waitForSelector('a[class^="widget-ExpertLogo-link"][href="' + location + '"]', { timeout: 75000 });
      } else {
        const ifSpecialist = await context.evaluate(function () {
          return document.querySelector('a[class^="widget-ExpertLogo-link"]') ? (document.querySelector('a[class^="widget-ExpertLogo-link"]').href === 'https://www.expert.de/') : false;
        });

        if (!ifSpecialist) {
          throw new Error('Not in right zipcode');
        }
      }
    } else {
      // if no zipcode is passed
      console.log('No zipcode was passed')
    }

    /**
     * If zipcode was passed, we set zipcode by making 1st GOTO above
     * Then goto to searh url
     * 
     * If no zipcode was passed, goto to default zipcode 
     */
    console.log('Making normal goto => ', url);
    await context.goto(url, {
      block_ads: false,
      anti_fingerprint: true,
      discard_CSP_header: false,
      timeout: 100000,
      waitUntil: 'load',
    });
  },

};
