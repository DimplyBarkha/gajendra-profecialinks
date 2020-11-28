const { transform } = require('../format');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // const applyScroll = async function (context) {
  //   await context.evaluate(async function () {
  //     let scrollTop = 0;
  //     while (scrollTop !== 20000) {
  //       await stall(500);
  //       scrollTop += 1000;
  //       window.scroll(0, scrollTop);
  //       if (scrollTop === 20000) {
  //         await stall(2000);
  //         break;
  //       }
  //     }
  //     function stall (ms) {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           resolve();
  //         }, ms);
  //       });
  //     }
  //   });
  // };
  // await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  // await context.setLoadAllResources()
  // await applyScroll(context);
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));

  await context.evaluate(async function () {
    function addElementToDocument(doc, key, value) {
      try {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      } catch (err) { }
    }

    async function fetchItems(ids) {
      const url = `https://nm-2-card.wildberries.ru/enrichment/v1/api?nm=${ids}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('response ==', response);
      console.log('response.status ==', response.status);

      if (response && response.status === 404) {
        console.log('Product Not Found!!!!');
      }

      if (response && response.status === 200) {
        console.log('Product Found!!!!');
        const retObj = await response.json();
        const productInfo = retObj.data.products;
        return productInfo;
      }
      return {};
    }

    function findCatalogJsonData(startString, endString) {
      try {
        const xpath = '//script[@type="text/javascript"][contains(.,"shortProducts:")]';
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const scriptContent = element.textContent;
        const startIdx = scriptContent.indexOf(startString);
        let jsonStr = scriptContent.substring(startIdx + startString.length).trim();
        const endIdx = jsonStr.indexOf(endString);

        jsonStr = jsonStr.substring(0, endIdx + endString.length - 1).trim();
        jsonStr = jsonStr.trim();
        jsonStr = jsonStr.replace('shortProducts', '"shortProducts"').replace('nms', '"nms"');
        return JSON.parse(jsonStr);
      } catch (error) {
        console.log(error.message);
      }
    }

    function findId(dataObj, idToCheck) {
      try {
        const val = dataObj[idToCheck];
        if (val) {
          return val.sizes[0].ch;
        }
      } catch (err) { }
      return "";
    }

    function findIdFromApi(dataObj, idToCheck) {
      try {
        const val = dataObj.find(data => data.id == idToCheck);
        if (val) {
          return val.sizes[0].optionId;
        }
      } catch (err) { }
      return "";
    }

    // elements from data Layer object
    let catalogDataObj = findCatalogJsonData('{shortProducts:', '}},')
    if (catalogDataObj) {
      const objArr = [];
      const idsToCheckArr = [];

      const arr = document.querySelectorAll('div.catalog_main_table.j-products-container>div.dtList.i-dtList.j-card-item');
      for (let i = 0; i < arr.length; i++) {
        const doc = arr[i];
        const idSelc = doc.getAttribute('data-catalogercod1s');
        idsToCheckArr.push(idSelc);
        let prodId = findId(catalogDataObj, idSelc);
        objArr.push(prodId);
        if (prodId === '') prodId = idSelc;
        addElementToDocument(doc, 'added-id', prodId);
      }
      // return ['this is from if block::', catalogDataObj];
    } else {
      const idArry = [];
      const arr = document.querySelectorAll('div.catalog_main_table.j-products-container>div.dtList.i-dtList.j-card-item');
      for (let i = 0; i < arr.length; i++) {
        const doc = arr[i];
        const idSelc = doc.getAttribute('data-catalogercod1s');
        idArry.push(idSelc);
      }
      const ids = idArry.join(';');
      const prodInfo = await fetchItems(ids);
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      for (let i = 0; i < arr.length; i++) {
        const doc = arr[i];
        const idSelc = doc.getAttribute('data-catalogercod1s');
        let prodId = findIdFromApi(prodInfo, idSelc);
        if (prodId === '') prodId = idSelc;
        addElementToDocument(doc, 'added-id', prodId);
      }
      // return  ['this is from else block::', ids, prodInfo];;
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'wildberries',
    transform: transform,
    domain: 'wildberries.ru',
    zipcode: '',
  },
  implementation,
};
