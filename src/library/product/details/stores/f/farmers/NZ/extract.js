const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'farmers',
    transform: transform,
    domain: 'farmers.co.nz',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const imageEle = await context.evaluate(async () => {
      const imageEle = document.querySelectorAll('div#inpage_container img');
      return imageEle;
    });
    console.log('imageEle', imageEle);
    if (Object.keys(imageEle).length !== 0) {
      await context.waitForSelector('div#inpage_container img');
    }
    await context.evaluate(async () => {
      var src = '';
      const imageEle = document.querySelectorAll('div#inpage_container img');
      const videoEle = document.querySelector('a.phone-thumb-overlay-YouTube');
      if (videoEle) {
        videoEle.click();
        src = document.querySelector('div.ish-product-photo iframe').getAttribute('src');
        if (src) {
          addHiddenDiv('video-url', src);
        }
      }
      if (Object.keys(imageEle).length !== 0) {
        var urls = [];
        imageEle.forEach((ele) => {
          var imageUrls = ele.getAttribute('data-flixsrcset');
          if (imageUrls && imageUrls.length > 0) {
            var str = imageUrls.split(',')[0].split(' ')[0];
            urls.push('https:' + str);
          };
        });
        if (urls.length > 0) {
          addHiddenDiv('manufacture-images', urls.join(','));
        }
      }
      var manufacturer = window.productDetails ? (JSON.parse(window.productDetails)).Manufacturer : '';
      if (manufacturer) {
        addHiddenDiv('manufacture-name', manufacturer);
      }
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
