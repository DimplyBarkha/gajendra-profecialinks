const { cleanUp } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  // extracting data in default url
  const { productDetails } = dependencies;
  const { transform } = parameters;

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

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await context.evaluate(() => {
      const manufacturerImages = document.querySelectorAll('img');
      let image;
      const manufacturerDescription = document.querySelector('body').innerText;
      const manufacturerDescriptionBullets = document.querySelectorAll('body ul>li');
      let k = 0;
      manufacturerDescriptionBullets.forEach(bullet => {
        k++;
      });

      document.querySelector('body').setAttribute('bulletsnumber', `${k}`);

      for (let i = 0; i < manufacturerImages.length; i++) {
        const manufacturerDiv = document.createElement('div');
        manufacturerDiv.className = 'manufacturer-info';
        document.body.appendChild(manufacturerDiv);

        image = manufacturerImages[i].src;

        document.querySelectorAll('.manufacturer-info')[i].setAttribute('src', image);
      }
      document.querySelector('.manufacturer-info').setAttribute('description', manufacturerDescription);
    });

    await context.evaluate(() => {
      if (document.querySelector('div.ccs-cc-inline-embedded-video') !== null) {
        document.querySelector('div.ccs-cc-inline-embedded-video').click();
      }
    });

    // set promises to get videoLength and to extract data (redirecton with extract give an error)

    await new Promise((resolve) => setTimeout(resolve, 3000));
    // extract data in iframe

    await context.extract(productDetails, { transform });

    await new Promise((resolve) => setTimeout(resolve, 3000));
  };
  await context.goto(url);
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage_10101',
    transform: cleanUp,
    domain: 'staplesadvantage.com',
    zipcode: '10101',
  },
  implementation,
};
