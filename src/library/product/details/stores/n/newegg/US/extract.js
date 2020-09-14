const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'newegg',
    transform,
    domain: 'newegg.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      var imageListNode;
      const moreImages = document.querySelector('a.noLine abbr');
      const video = document.querySelector('video.jw-video');
      if (moreImages) {
        moreImages.click();
        imageListNode = document.querySelectorAll('#segImageList img');
      } else {
        imageListNode = document.querySelectorAll('.navThumbs li a img');
      }
      if (imageListNode && imageListNode.length > 0) {
        var imageSrc = [];
        imageListNode.forEach((ele) => {
          imageSrc.push(ele.getAttribute('src'));
        });
        if (imageSrc && imageSrc.length > 0) {
          imageSrc = imageSrc.map((ele) => 'https:' + ele);
          addHiddenDiv('alternate-images', imageSrc.join(','));
        }
      }
      if (video) {
        var url = '';
        video.click();
        url = video.getAttribute('src');
        if (url) {
          addHiddenDiv('video-url', url);
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
