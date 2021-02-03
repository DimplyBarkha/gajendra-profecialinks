const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'angeloni',
    transform,
    domain: 'angeloni.com.br/super',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForSelector('.box-produto a');
    await context.evaluate(async () => {
      if (document.querySelector('.box-produto a')) {
        document.querySelector(('.box-produto a')).removeAttribute('onClick');
        document.querySelector(('.box-produto a')).removeEventListener('click', () => {
        }, false);
      }
    });
    // await new Promise((resolve, reject) => setTimeout(resolve, 100000));
    await context.clickAndWaitForNavigation('.box-produto a', {}, {});
    await context.evaluate(async () => {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(200);
        scrollTop += 2000;
        window.scroll(0, scrollTop);
        if (scrollTop === 30000) {
          await stall(2000);
          break;
        }
      }

      function stall (ms) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      function addElementToDocument (key, value) {
        const createdElem = document.querySelector(`#${key}`);
        if (!createdElem) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }
      }

      const jsonDataNodes = document.querySelectorAll('[type="application/ld+json"]');
      let jsonDataText = '';
      jsonDataNodes.forEach(jsonDataNode => {
        const jsonDataNodeText = jsonDataNode.textContent;
        jsonDataText = jsonDataNodeText.includes('price') ? jsonDataNodeText : '';
      });
      const jsonDataObject = jsonDataText ? JSON.parse(jsonDataText) : null;
      if (jsonDataObject) {
        // pirce
        addElementToDocument('ag-price', jsonDataObject.offers.price);
        // availabilityText
        if (jsonDataObject.offers.availability) {
          jsonDataObject.offers.availability.includes('OutOfStock')
            ? addElementToDocument('ag-availability', 'Out of stock')
            : addElementToDocument('ag-availability', 'In stock');
        }
      }

      // zoom
      const mainImg = document.querySelector('.box-galeria img');
      if (mainImg && mainImg.classList.contains('zoom')) {
        addElementToDocument('ag-zoom', 'Yes');
      } else {
        addElementToDocument('ag-zoom', 'No');
      }

      // descriptionBullets
      let bulletsMatch = 0;
      let boxInfoContent = '';
      const descrInfo = document.querySelectorAll('.box-info-produto__info');
      if (descrInfo) {
        descrInfo.forEach(descrInfoItem => {
          const descrInfoText = descrInfoItem.textContent;
          boxInfoContent += descrInfoText.trim().replace(/(\r\n|\n|\r)/, ' ');
          if(descrInfoText.match(/•/gmi)){
            bulletsMatch = bulletsMatch + descrInfoText.match(/•/gmi).length;
          }
        })
        if (bulletsMatch > 0) {
          addElementToDocument('ag-desc-bullets', bulletsMatch);
        }
        if (boxInfoContent) {
          addElementToDocument('ag-desc-text', boxInfoContent);
        }
      }

      const descrInfoTitles = document.querySelectorAll('h2.titulo');
      let descrInfoArr;
      descrInfoTitles.forEach(descrInfoTitle => {
        if (descrInfoTitle.textContent.includes('Informações Adicionais')) {
          const descrInfoNode = descrInfoTitle.nextElementSibling;
          const descrInfoInner = descrInfoNode.innerHTML;
          descrInfoArr = descrInfoInner.replace(/&nbsp;/gm, '').split('<br>');
        }
      });
      if (descrInfoArr) {
        descrInfoArr.forEach(descrItem => {
          function getInfoItem (infoItem, infoStr, divId) {
            if (infoItem.toLowerCase().includes(infoStr)) {
              const textValue = descrItem.replace(/.* - /, '');
              addElementToDocument(divId, textValue);
              return textValue;
            }
          }
          getInfoItem(descrItem, 'marca', 'ag-brand');
        });
      }


      const breadcumbsItems = document.querySelectorAll('.breadcumb__link span');
      if(breadcumbsItems){
        const breadcumbsList = document.createElement('ul');
        breadcumbsList.id = 'breadcumbsList'
        document.body.append(breadcumbsList);
        breadcumbsItems.forEach((item, index) => {
          const breadcumbsItem = document.createElement('li');
          breadcumbsItem.textContent = item.textContent;
          breadcumbsList.append(breadcumbsItem);
          // addElementToDocument(`breadcumbsItem breadcumbsItem-${index}`, item.textContent);
        })
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
