
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'expert.de',
    timeout: 35000,
    country: 'DE',
    store: 'expert',
    // suffix: '/ahlen',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
    // USING OPT TAGS > anti_fingerprint), to avoid blocking
    // #[!opt!]{"anti_fingerprint":false}[/!opt!]
    // await context.setBlockAds(false);
    // await context.goto(`${url}`, {
    //   anti_fingerprint: true,
    //   discard_CSP_header: true,
    //   timeout: 100000,
    //   waitUntil: 'load',
    // });
    // await context.setBlockAds(false);
    // await context.goto(`${url}#[!opt!]{"anti_fingerprint":true, "discard_CSP_header":false}[/!opt!]`, {
    //       images_enabled: true,
    //       timeout: 100000,
    //       waitUntil: 'load',
    // })
    let location = '';

    if (zipcode === 'ahlen') {
      location = '/ahlen';
    } else if (zipcode === 'saarwellingen') {
      location = '/saarwellingen';
    } else if (zipcode === 'loerrach') {
      location = '/loerrach';
    } else if (zipcode === 'nuernberg') {
      location = '/nuernberg1';
    } else if (zipcode === 'mannheim') {
      location = '/mannheim1';
    }

    await context.setBlockAds(false);
    await context.goto(`https://www.expert.de${location}`, {
      anti_fingerprint: true,
      discard_CSP_header: false,
      timeout: 100000,
      waitUntil: 'load',
    });

    if (zipcode && zipcode.length) {
      // const zipcodeHref = document.querySelector('a[class^="widget-ExpertLogo--link"]') ? document.querySelector('a[class^="widget-ExpertLogo--link"]').getAttribute('href') : '';
      await context.waitForSelector('a[class^="widget-ExpertLogo--link"][href="' + location + '"]', { timeout: 55000 });
    }

    // if (zipcode.length) {
    //   const splitUrl = url.split('https://www.expert.de/');
    //   const firstPart = splitUrl[0];
    //   const secondPart = splitUrl[0];
    // }
    // const ahlen = 'ahlen';
    // const saarwellingen = 'saarwellingen';
    // const mannheim = 'Mannheim1';
    // const nuernberg = 'nuernberg1';
    // const loerrach = 'loerrach';
    // location = `/${ahlen}`;

    await context.setBlockAds(false);
    await context.goto(`${url}`, {
      anti_fingerprint: true,
      discard_CSP_header: false,
      timeout: 100000,
      waitUntil: 'load',
    });
  },

};
