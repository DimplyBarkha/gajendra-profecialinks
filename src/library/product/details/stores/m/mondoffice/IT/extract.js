const {transform} = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    transform,
    domain: 'mondoffice.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const {transform} = parameters;
    const {productDetails} = dependencies;
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const bread = document.querySelectorAll('.page-breadcrumb__item');
      if (bread) {
        addElementToDocument('breadCramb', '');
        const a = document.getElementById('breadCramb');
        for (let i = 0; i < bread.length; i++) {
          const newContent = document.createElement('p');
          newContent.innerHTML = bread[i].innerText;
          a.appendChild(newContent);
        }
      }
      addElementToDocument('url', location.href);

      const dataJsonNode = document.querySelectorAll('[type="application/ld+json"]');
      if(dataJsonNode){
        let dataJsonText = '';
        if(dataJsonNode){
          dataJsonNode.forEach(dataNode => {
            dataJsonText =  dataJsonText + dataNode.textContent;
          })
        }
        dataJsonText.includes('InStock') ? addElementToDocument('mo-availability', 'In Stock') : addElementToDocument('mo-availability', 'Out of stock');
      };

      const sctiptNodes = document.querySelectorAll('script');

      sctiptNodes.forEach(sctiptNode => {
        if(sctiptNode.textContent.match(/ProductId/gmi)){
          const productMatchId = sctiptNode.textContent.match(/ProductId=.*&/gmi);
          if(productMatchId && productMatchId.length){
            const productId = productMatchId[0].replace(/ProductId=/, '').replace(/&/, '');
            addElementToDocument('mo-product-id', productId);
          }
        }
      });

      const descrItems = document.querySelectorAll('.description-sku__attribute li');
      descrItems.forEach(descrItem => {
        if(descrItem.textContent.match(/(Capacità|Dimensione punta|Dimensioni foglietto)/gmi)){
          addElementToDocument('mo-size', descrItem.querySelector('strong').textContent);
        }
        if(descrItem.textContent.match(/mpn/gmi)){
          addElementToDocument('mo-mpc', descrItem.querySelector('strong').textContent);
        }
      })

    });
    await context.waitForSelector('#breadCramb');
    return await context.extract(productDetails, {transform});
  },
};
