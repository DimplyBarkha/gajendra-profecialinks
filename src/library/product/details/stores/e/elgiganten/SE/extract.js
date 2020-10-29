const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('div#coiOverlay:not([style*="none"])')
    await context.click('div#coiOverlay:not([style*="none"]) button.coi-banner__accept[aria-label*="JAG"]')
  } catch (error) {
    console.log('cookie pop up not loded', error);
  }
  await context.evaluate(async () => {
    function addHiddenDiv (vidurl, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('data-vidurl', vidurl);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    if (document.querySelector('div.product-more-info')) {
      document.querySelector('li#tab-specs').click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else if (document.querySelector('div.tab-specs-row')) {
      document.querySelector('li#tab-more-info').click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const sku = document.querySelector('p[data-product-sku]').getAttribute('data-product-sku');
    const name = document.querySelector('h1.product-title').innerText;
    const vidApiUrl = `https://dapi.videoly.co/1/videos/0/407/?SKU=${sku}&productTitle=${name}&hn=www.elgiganten.se`;
    const videoApi = await fetch(vidApiUrl,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'GET',
      },
    ).then(x => x.json());

    const video = videoApi.items;
    let videoUrl;
    video.forEach(vid => {
      videoUrl = `https://www.youtube.com/watch?v=${vid.videoId}&feature=youtu.be`;
      addHiddenDiv('vidURL', videoUrl);
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    transform: transform,
    domain: 'elgiganten.se',
    zipcode: '',
  },
  implementation,
};
