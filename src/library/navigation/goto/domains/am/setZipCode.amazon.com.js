const implementation = async (inputs, parameters, context, dependencies) => {
  const { zipcode, url } = inputs;

  const apiZipChange = await context.evaluate(async (zipcode) => {
    async function callApiToChangeZip (zipcode) {
      const body = `locationType=LOCATION_INPUT&zipCode=${zipcode}&storeContext=amazonfresh&deviceType=web&pageType=Search&actionSource=glow&almBrandId=undefined`;
      const currentUrl = window.location.href;
      const response = await fetch("https://www.amazon.com/gp/delivery/ajax/address-change.html", {
        "headers": {
          "accept": "text/html,*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
          "downlink": "0.45",
          "ect": "3g",
          "rtt": "400",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": currentUrl,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": body,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });
      console.log('ZIPCODE CHANGED:' + response.status);
      return response.status === 200;
    }

    let retries = 0;
    while (retries < 3) {
      if (await callApiToChangeZip(zipcode)) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
      retries = retries + 1;
      console.log(`API Failed retrying, retry: ${retries}`);
    }
  }, zipcode);

  const {
    Helpers: { Helpers },
    AmazonHelp: { AmazonHelp },
  } = dependencies;
  const helpers = new Helpers(context);
  const amazonHelp = new AmazonHelp(context, helpers);
  console.log(`api-zip-change ${apiZipChange}`);
  const onCorrectZip = await context.evaluate((zipcode) => {
    const zipText = document.querySelector('div#glow-ingress-block');
    return zipText.textContent.includes(zipcode);
  }, zipcode);
  console.log(`zip-present-in div in dom ${onCorrectZip}`);
  const tryTillPageLoads = async () => {
    let loadedTillNow = 1;
    const maxTryOut = 4;
    let lastResponseData = await context.goto(
      'https://www.amazon.com/s?k=fragrance&i=amazonfresh&ref=nb_sb_noss_2',
      {
        timeout: 20000,
        waitUntil: 'load',
        checkBlocked: false,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      },
    );
    await new Promise((resolve) => setTimeout(resolve, 3000));
    lastResponseData = await context.goto(url, {
      timeout: 20000,
      block_ads: false,
      anti_fingerprint: false,
      load_all_resources: true,
      waitUntil: 'load',
      checkBlocked: false,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    while (lastResponseData.status !== 200 && loadedTillNow <= maxTryOut) {
      console.log(`this is trial no. : ${loadedTillNow}`);
      lastResponseData = await context.goto(url, {
        timeout: 20000,
        block_ads: false,
        anti_fingerprint: false,
        load_all_resources: true,
        waitUntil: 'load',
        checkBlocked: false,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      loadedTillNow++;
    }

    if (lastResponseData.status === 200) {
      console.log(`Finally got the data after - ${loadedTillNow} times`);
      console.log(lastResponseData.status);
    }
  };
  if (!onCorrectZip) {
    if (!apiZipChange) {
      await amazonHelp.setLocale(zipcode);
      await context.evaluate((zipcode) => {
        const zipText = document.querySelector('div#glow-ingress-block');
        console.log('ZIPCODE CONFIRMATION: ' + zipText.textContent);
        if (!zipText.textContent.includes(zipcode)) {
          throw new Error('API and manual Zip change failed');
        }
      }, zipcode);
    } else {
      await tryTillPageLoads();
    }
  }
};

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'amazon.com',
    store: 'amazonFresh',
    zipcode: '90210',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
