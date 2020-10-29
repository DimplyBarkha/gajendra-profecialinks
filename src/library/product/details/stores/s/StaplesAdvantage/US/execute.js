async function implementation (inputs, parameters, context, dependencies) {
  const url = 'https://www.staplesadvantage.com/product_{id}'.replace(
    '{id}',
    encodeURIComponent(inputs.id),
  );
  const loginUrl = 'https://www.staplesadvantage.com/idm';

  // after the search results page and checking loadedSelector and noResultsXPath

  // the extractor goes to the logging in page
  await context.goto(loginUrl);

  await context.waitForNavigation();
  // the popup is visible after a moment -> delaying the removal
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const isPopupPresent = await context.evaluate(async () => {
    return document.querySelector('div.truste_box_overlay');
  });
  // when the popup is present it returns undefined, when not - null
  if (isPopupPresent !== null) {
    await context.evaluate(() => {
      document.querySelector('div.truste_box_overlay').remove();
      document.querySelector('div.truste_overlay').remove();
    });
  }
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const isUserLogged = await context.evaluate(async () => {
    const currentUrl = window.location.href;
    return !currentUrl.includes('idm');
  });
  // when the user is not logged in, the extractor fills out the form
  if (!isUserLogged) {
    // filling in the inputs only works after clicking them first
    await context.click('input[name="accountNumber"]');
    await context.evaluate(async () => {
      document.querySelector('input[name="accountNumber"]').setAttribute('value', '1021401');
    });
    await context.click('input[name="userId"]');
    // after filling in the account number input and clicking away, the page is reloaded
    // and the extractor needs to wait to fill in the rest of the inputs
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await context.evaluate(async () => {
      document.querySelector('input[name="userId"]').setAttribute('value', 'LLAWSON');
    });

    await context.click('input[name="password"]');
    await context.evaluate(async () => {
      document.querySelector('input[name="password"]').setAttribute('value', 'Norris2017');
    });
    // clicking outside the form after filling it out
    // then clicking the log in button
    await context.click('section[aria-label="Contact us"]');
    await context.click('div[id="loginBtn"]');
  };
  // logging in takes a moment and reloads the page, then goes to the homepage
  await context.waitForNavigation();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // going to the search results page
  await context.goto(url);

  // removing again loaded popup

  await new Promise((resolve) => setTimeout(resolve, 3000));

  if (isPopupPresent !== null) {
    await context.evaluate(() => {
      document.querySelector('div.truste_box_overlay').remove();
      document.querySelector('div.truste_overlay').remove();
    });
  };

  // checking if shipping info link is present

  const isShippingInfoLinkPresent = await context.evaluate(async () => {
    return document.querySelector('div.delivery-info-ux2__additional_info div a');
  });

  // clicking on delivery link in order to receive shipping info

  if (isShippingInfoLinkPresent !== null) {
    await context.evaluate(() => {
      document.querySelector('div.delivery-info-ux2__additional_info div a').click();
    });
  };

  await context.extract('/product/details/stores/s/StaplesAdvantage/US/extract');

  // going to iFrame url, if exists, in order to receive data from it

  const iFrameSrc = await context.evaluate(async () => {
    return document.querySelector('iframe.iframe-wrapper__cnet_iframe').src;
  });

  const iFrameContent = await context.evaluate(async () => {
    return document.querySelector('iframe.iframe-wrapper__cnet_iframe').style.height;
  });

  // checking if iFrame has a content

  if (iFrameContent !== '8px') {
    await context.goto(iFrameSrc);

    await context.click('div.ccs-cc-inline-embedded-video');

    // waiting video to load

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // extract data in iframe

    // const iFrame = await context.evaluate(async () => {
    //   var manufacturerImages = document.querySelectorAll('a[class="ccs-cc-thumbnail-wrapper"]>img');
    //   var videos = document.querySelectorAll('video');
    //   var videoLength = document.querySelectorAll('span[class="mejs__duration"]');
    //   return { manufacturerImages: manufacturerImages, videos: videos, videoLength: videoLength };
    // });

    // going back to default page

    // const dataRef = await context.data();

    // dataRef[0].data[0].group[0].manufacturerImage[0].text = iFrame.manufacturerImage,
    //   dataRef[0].data[0].group[0].videos[0].text = iFrame.videos,
    //   dataRef[0].data[0].group[0].videoLength[0].text = iFrame.videoLength,

    // await context.goto(url);
  };

  return await context.evaluate(function (xp) {
    const r = document.evaluate(
      xp,
      document,
      null,
      XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
      null,
    );
    const e = r.iterateNext();
    return !e;
  }, parameters.noResultsXPath);
};

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage',
    domain: 'staplesadvantage.com',
    url: 'https://www.staplesadvantage.com//product_{id}',
    zipcode: '',
  },
  implementation,
};
