const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    transform,
    domain: 'iga.net',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, dependencies) => {
    async function addUrl () {
      const searchUrl = localStorage.getItem('url');
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }
      var url = window.location.href;
      addHiddenDiv('added-searchurl', searchUrl);
      const doc = document.querySelector('div.js-data-procuct');
      if (searchUrl !== url && doc) {
        url = url.replace('https://www.iga.net', '');
        addElementToDocument(doc, 'added-producturl', url);
      }
    }
    await context.evaluate(addUrl);
    return await context.extract(dependencies.productDetails, { transform: transformParam });
  },
};
