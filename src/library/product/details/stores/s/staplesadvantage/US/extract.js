async function implementation (inputs, parameters, context, dependencies) {
  // extracting data in default url
  const { productDetails } = dependencies;

  const url = 'https://www.staplesadvantage.com/product_{id}'.replace(
    '{id}',
    encodeURIComponent(inputs.id),
  );

  await context.extract(productDetails);

  const iFrameSrc = await context.evaluate(async () => {
    return document.querySelector('iframe.iframe-wrapper__cnet_iframe').src;
  });

  const iFrameContent = await context.evaluate(async () => {
    return document.querySelector('iframe.iframe-wrapper__cnet_iframe').style.height;
  });

  // checking if iFrame has a content

  if (iFrameContent !== '8px') {
    await context.goto(iFrameSrc);

    // if video exists click in play button

    await context.evaluate(() => {
      if (document.querySelector('div.ccs-cc-inline-embedded-video') !== null) {
        document.querySelector('div.ccs-cc-inline-embedded-video').click();
      }
    });
    // extract data in iframe

    await context.extract(productDetails);

    await new Promise((resolve) => setTimeout(resolve, 3000));
  };
  await context.goto(url);
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage',
    transform: null,
    domain: 'staplesadvantage.com',
    zipcode: '',
  },
  implementation,
};
