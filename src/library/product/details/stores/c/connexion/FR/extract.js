const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'connexion',
    transform,
    domain: 'connexion.fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }

      const getIframeimg = async function () {
        const iFrame = document.querySelector('iframe');
        const domainUrl = document.location.host;
        if (iFrame !== null) {
          const iFrameSrc = document.querySelector('iframe').getAttribute('src');
          var src = iFrameSrc.substring(0, iFrameSrc.lastIndexOf('/') + 1);
          var finalSrc = iFrame.contentWindow.document.getElementsByTagName('img');
          for (let index = 0; index < finalSrc.length; index++) {
            addEleToDoc('pd_manufacturerImages', domainUrl + src + finalSrc[index].getAttribute('src'));
          }
        }
      };
      await getIframeimg();
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
