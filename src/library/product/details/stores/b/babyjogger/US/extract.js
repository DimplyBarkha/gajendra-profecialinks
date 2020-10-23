const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'babyjogger',
    transform,
    domain: 'babyjogger.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      var selectedProduct = document.evaluate("//span[contains(text(),'selected')]/parent::div", document.body, null, 9, null).singleNodeValue;
      var variantArr = [];
      function timeout (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      const getVariant = async function () {
        var imageRows = [...document.querySelectorAll('div.color-attribute')];
        for (let index = 0; index < imageRows.length; index++) {
          imageRows[index].click();
          await timeout(2000);
          var variantUrl = window.location.href.replace(new RegExp('(.+SAP_)(.+)(.ht.+)', 'g'), '$2');
          var colour = document.querySelector('.color-display-value.order-3.ml-1') ? document.querySelector('.color-display-value.order-3.ml-1').textContent : '';
          var data = colour.concat('-', variantUrl);
          variantArr.push(variantUrl);
          const div = document.createElement('div');
          div.className = 'variant';
          const getInput = document.createElement('input');
          div.appendChild(getInput);
          document.body.appendChild(div);
          getInput.setAttribute('value', data);
          await timeout(5000);
        }
        selectedProduct.click();
        await timeout(2000);
      };
      await getVariant();
      const breadcrumbs = document.querySelectorAll('li.breadcrumb-item');
      if (breadcrumbs.length > 1) {
        for (let i = 0; i < breadcrumbs.length - 1; i++) {
          var div = document.createElement('li');
          div.className = 'categories';
          var getInput = document.createElement('input');
          div.appendChild(getInput);
          document.head.appendChild(div);
          getInput.setAttribute('value', breadcrumbs[i + 1].querySelector('a').innerText);
        }
      } else {
        const breadcrumbs = document.querySelector('li.breadcrumb-item a');
        if (breadcrumbs) {
          const div = document.createElement('li');
          div.className = 'categories';
          const getInput = document.createElement('input');
          div.appendChild(getInput);
          document.head.appendChild(div);
          getInput.setAttribute('value', breadcrumbs.innerText);
        }
      }
      const getAllImages = document.querySelectorAll('button.carousel-img-wrap img');
      const allImages = [];
      for (let i = 0; i < getAllImages.length; i++) {
        allImages.push(getAllImages[i].getAttribute('src'));
      }
      const uniqueChars = [...new Set(allImages)];
      for (let i = 0; i < uniqueChars.length; i++) {
        const div = document.createElement('div');
        div.className = 'secondaryimages';
        const getInput = document.createElement('input');
        div.appendChild(getInput);
        document.body.appendChild(div);
        getInput.setAttribute('value', uniqueChars[i]);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
