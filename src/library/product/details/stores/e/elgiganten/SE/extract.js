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
  const hasBtn = await context.evaluate(async function () {
    return Boolean(document.querySelector('button.coi-banner__accept'));
  });

  if (hasBtn) {
    try{
    await context.click('button.coi-banner__accept');
    }
    catch(exception){
      console.log('Unable to click accept button')
    }
  }
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);

  try {
    await context.waitForSelector('div.recommended-products', { timeout: 35000 });
  } catch (error) {
    console.log('No recommended products ');
  }  


  async function scrollToRec (node) {
    await context.evaluate(async function (node) {
      var element = (document.querySelector(node)) ? document.querySelector(node) : null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 7000);
        });
      }
    }, node);
  }
  await scrollToRec('section.article-page');
  await scrollToRec('div.recommended-products');
  try {
    await context.waitForSelector('iframe.videoly-box', { timeout: 30000 });
  } catch (error) {
    console.log('No video ');
  }  
await context.evaluate(async () => {
    function addHiddenDiv (vidurl, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('data-vidurl', vidurl);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    if (document.querySelector('section.section.product-more-info')){
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
