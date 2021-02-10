const { transform } = require('./format');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails, goto } = dependencies;

  function stall(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
  await context.evaluate(async function () {

    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    function fetchDetailsFromScript() {
      const scriptTagSelectorLD = document.querySelector('script[type="application/ld+json"]');
      const scriptTagDataLD = scriptTagSelectorLD ? scriptTagSelectorLD.innerText : '';
      let scriptTagJSONLD = '';
      try {
        scriptTagJSONLD = scriptTagDataLD ? JSON.parse(scriptTagDataLD) : '';
      } catch (e) {
        console.log('Error in converting text to JSON....');
        scriptTagJSONLD = '';
      }
      let sku = scriptTagJSONLD ? scriptTagJSONLD.sku ? scriptTagJSONLD.sku : '' : '';
      // If sku is blank then taking product id as sku
      if (!sku) {
        const skuSelector = document.querySelector('div[class*="f-productPage"]');
        sku = skuSelector ? skuSelector.getAttribute('data-prid') : '';
      }
      addHiddenDiv('added_sku', sku);
    }
    fetchDetailsFromScript();
  });

  const url = await context.evaluate(function () {
    return window.location.href;
  });

  const iframeUrl = await context.evaluate(function () {
    if (document.getElementById('eky-dyson-iframe')) {
      return document.getElementById('eky-dyson-iframe').getAttribute('src');
    }
  });

  let video = [];
  if (iframeUrl) {
    await context.goto(iframeUrl, { timeout: 50000 });
    await stall(2000);

    await context.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      async function infiniteScroll() {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
    });

    video = await context.evaluate(function () {
      let vid = document.querySelectorAll('div[class="eky-header-video-container black"] video')
      return Array.from(vid).map(video => video && video.getAttribute('src'))
    });
    
    /**
     * Using dependencies.goto
     * On coming back to main url, we sometimes encounter captcha again.
     */
    await goto({url});
  }
  await stall(3000);

  await context.evaluate(async function (video) {

    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    addHiddenDiv('videos', video);
  }, video);
  return await context.extract(productDetails, { transform });

}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'fnac',
    transform,
    domain: 'fnac.com',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    goto: 'action:navigation/goto',
  },
  implementation,
};
