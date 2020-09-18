const { transform } = require('../format');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    function fetchVideoURL () {
      const videoSelector = document.querySelector('input[class="flix-jw"]');
      let videoFileSrc = videoSelector ? videoSelector.value : '';
      try {
        videoFileSrc = videoFileSrc ? JSON.parse(videoFileSrc) : '';
      } catch (e) {
        console.log('Error in converting text to JSON....');
        videoFileSrc = '';
      }
      let videoLink = videoFileSrc ? videoFileSrc.playlist ? videoFileSrc.playlist[0] ? videoFileSrc.playlist[0].file ? videoFileSrc.playlist[0].file : '' : '' : '' : '';
      if (videoLink && !videoLink.includes('https')) {
        videoLink = 'https:' + videoLink;
      }
      addHiddenDiv('added-video', videoLink);
    }

    function fetchDataFromScript () {
      const scriptTagSelector = document.querySelector('script[type="application/ld+json"]');
      let scriptTagData = scriptTagSelector ? scriptTagSelector.innerText : '';
      scriptTagData = scriptTagData ? scriptTagData.replace(/(\n){1,}/g, '') : '';
      let scriptTagJSON = '';
      try {
        scriptTagJSON = scriptTagData ? JSON.parse(scriptTagData) : '';
      } catch (e) {
        console.log('Error in converting text to JSON....');
        scriptTagJSON = '';
      }
      const sku = scriptTagJSON ? scriptTagJSON.sku : '';
      const productID = scriptTagJSON ? scriptTagJSON.productID : '';
      const mpn = scriptTagJSON ? scriptTagJSON.mpn : '';
      addHiddenDiv('added-sku', sku);
      addHiddenDiv('added-productID', productID);
      addHiddenDiv('added-mpn', mpn);
    }

    function fetchDescription () {
      const descriptionSelector = document.querySelector('*[id="overview"]');
      const description = descriptionSelector ? descriptionSelector.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
      addHiddenDiv('added-description', description);
    }

    function fetchBrandText () {
      const brandTextSelector = document.querySelector('div[class*="product-detail-container"] a[href*="brands/"] img');
      const brandText = brandTextSelector ? brandTextSelector.alt : '';
      addHiddenDiv('added-brandText', brandText);
    }

    fetchVideoURL();
    fetchDataFromScript();
    fetchDescription();
    fetchBrandText();
  });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'heathcotes',
    transform,
    domain: 'heathcotes.co.nz',
    zipcode: '',
  },
  implementation,
};
