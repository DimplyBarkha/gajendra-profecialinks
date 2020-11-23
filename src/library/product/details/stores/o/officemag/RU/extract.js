const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addElementToDom (element, id) {
      const div = document.createElement('div');
      div.id = id;
      div.innerHTML = element;
      document.body.appendChild(div);
    }

    // add product url
    const productUrl = window.location.href;
    addElementToDom(productUrl, 'productUrl');

    // add img url
    const prefix = 'https://www.officemag.ru';
    const rawImgNode = document.querySelector('a[id="photosListLink"] img');
    if (rawImgNode) {
      const imgUrl = rawImgNode.getAttribute('src');
      addElementToDom(prefix + imgUrl, 'imgUrl');
    }

    // alternate imgs
    const altImgsNode = document.querySelectorAll(
      'a[class="ProductPhotoThumb__link js-bigImg"] img');
    altImgsNode.forEach(element => {
      const altImgUrl = element.getAttribute('src');
      element.setAttribute('altImgUrl', prefix + altImgUrl);
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'officemag',
    transform: transform,
    domain: 'officemag.ru',
    zipcode: '',
  },
  implementation,
};
