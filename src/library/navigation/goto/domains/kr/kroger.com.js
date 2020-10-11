
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'kroger.com',
    country: 'US',
    store: 'kroger',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    console.log('Block ads set to false for context');
    const optUrl = `${url}#[!opt!]{"anti_fingerprint":false, "first_request_timeout": 60, "proxy":{"use_relay_proxy": false}}[/!opt!]`;
    console.log(`going to optUrt, which is - ${optUrl}`);
    await context.goto(optUrl, { timeout: 45000, waitUntil: 'load', checkBlocked: true });
    // const lastResponseData = await context.goto(optUrl, {
    //   timeout: 40000,
    //   block_ads: false,
    //   anti_fingerprint: false,
    //   load_all_resources: true,
    //   waitUntil: 'load',
    //   checkBlocked: false,
    //   js_enabled: true,
    //   css_enabled: false,
    //   random_move_mouse: true,
    //   proxy:{
    //     use_relay_proxy: true
    //   }
    // });
    // console.log(`response status - ${lastResponseData.status}`);
    // if(lastResponseData.status !== 200) {
    //   console.log('page not loaded properly');
    //   let dummyUrl = 'https://www.amazon.com';
    //   const lastResponseData = await context.goto(dummyUrl, {
    //     timeout: 25000,
    //     block_ads: false,
    //     anti_fingerprint: false,
    //     load_all_resources: true,
    //     waitUntil: 'load',
    //     checkBlocked: false,
    //     js_enabled: true,
    //     css_enabled: false,
    //     random_move_mouse: true,
    //     proxy:{
    //       use_relay_proxy: true
    //     }
    //   });
    //   console.log(`response status for home page - ${lastResponseData.status}`);
    // } else {
    //   console.log('page loaded ok');
    // }
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: optUrl, zipcode });
    }
  },
};
