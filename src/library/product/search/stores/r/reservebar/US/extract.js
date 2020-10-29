const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'reservebar',
    transform,
    domain: 'reservebar.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, dependencies) => {
    await context.evaluate(async () => {
      const productNode = document.getElementsByTagName('script');
      const nameNode = document.querySelectorAll('div.product_grid_desc div.grid-view-item__title');
      var idNode = '';
      var names = [];
      var idArr = [];
      if (nameNode.length) {
        nameNode.forEach((ele) => {
          names.push(ele.innerText);
        });
      }
      if (productNode.length) {
        for (var j = 0; j < productNode.length; j++) {
          var attr = productNode[j].getAttribute('name');
          if (attr && attr === 'littledata-tracking-tag') {
            idNode = JSON.stringify(productNode[j].innerText);
            break;
          }
        }
        if (idNode) {
          var productDesc = idNode.substring(
            idNode.lastIndexOf('var collectionProds'),
            idNode.lastIndexOf('var collectionProducts = buildCollectionProducts(collectionProds);'));
          productDesc = productDesc.replace('var collectionProds = [', '');
          productDesc = productDesc.replace(/\//g, '');
          if (productDesc) {
            var idStr = productDesc.split(',');
            names.forEach((ele) => {
              var regex = new RegExp(ele, 'i');
              for (var k = 0; k < idStr.length; k++) {
                var found = idStr[k].match(regex);
                if (found) {
                  var id = idStr[k].split('|');
                  if (id.length && id[0]) {
                    idArr.push(id[0].match(/\d+/)[0]);
                  }
                  break;
                }
              }
            });
            const productList = document.querySelectorAll('ul#products li div.product-card');
            const url = window.location.href;
            if (idArr.length) {
              var count = 0;
              if (idArr.length && productList.length) {
                productList.forEach((item1) => {
                  const doc = item1;
                  addElementToDocument(doc, 'fetch-product-id', idArr[count]);
                  addElementToDocument(doc, 'added-search-url', url);
                  count++;
                });
              }
            }
          }
        }
      }
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }
    });
    return await context.extract(dependencies.productDetails, { transform: transformParam });
  },
};
