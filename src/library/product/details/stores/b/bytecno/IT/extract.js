
const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'bytecno',
    transform: transform,
    domain: 'bytecno.it',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const videoEle = await context.evaluate(async () => {
      const videoEle = document.querySelector('.demoupUI-playimage');
      if (videoEle) {
        videoEle.click();
        return videoEle;
      }
    });
    if (videoEle) {
      await context.waitForSelector('div.demoupUI-videocontainer video source');
    }

    await context.evaluate(async () => {
      var src = '';
      const imageEle = document.querySelectorAll('div#inpage_container img');
      var ele = document.getElementsByTagName('source');
      src = (ele && ele.length > 0 && ele[0].src) ? ele[0].src : '';
      console.log('src', src);
      if (src) {
        addHiddenDiv('video-url', src);
      }
      if (imageEle) {
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
