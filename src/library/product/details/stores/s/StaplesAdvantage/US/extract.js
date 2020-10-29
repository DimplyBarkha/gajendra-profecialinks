async function implementation (inputs, parameters, context, dependencies) {
  // extracting data in default url

  const { productDetails } = dependencies;
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

    await context.click('div.ccs-cc-inline-embedded-video');

    // waiting video to load

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // extract data in iframe

    const { productDetails } = dependencies;
    await context.extract(productDetails);
  };
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage',
    transform: null,
    domain: 'staplesadvantage.com',
    zipcode: '10101',
  },
  implementation,
};
