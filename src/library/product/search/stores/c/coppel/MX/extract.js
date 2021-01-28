const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const { keywords } = inputs;
  await context.evaluate(async function () {

    const url = window.location.href;

    function addElementToDocumentOld (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      // catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
      if (Array.isArray(value)) {
        const innerHTML = value.reduce((acc, val) => {
          return `${acc}<li>${val}</li>`;
        }, '<ul>') + '</ul>';
        catElement.innerHTML = innerHTML;
      } else {
        catElement.textContent = value;
      }
      return catElement;
    }

    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };

    let data = {};
    var pageNo = 1;
   //const urlParams = new URLSearchParams(window.location.search);
   // const myParam = urlParams.get('pageNo');
   // var pathname = new URL(window.location.href).pathname;
   // var searchKey = pathname.split('search/')[1];
  //  var storeId = window.location.href.substring(window.location.href.lastIndexOf('store/') + 6, window.location.href.lastIndexOf('/search'));
    const fetchURL = `https://www.coppel.com/ProductListingView?searchType=1002&filterTerm=&langId=-5&advancedSearch=&sType=SimpleSearch&gridPosition=&metaData=&manufacturer=&ajaxStoreImageDir=https%3A%2F%2Fcdn2.coppel.com%2Fwcsstore%2FAuroraStorefrontAssetStore%2F&resultCatEntryType=2&catalogId=10001&resultsPerPage=12&emsName=&facet=&categoryId=&storeId=12761&disableProductCompare=false&ddkey=ProductListingView_6_1120&filterFacet=`;
    const windowUrl = window.location.href.split('search');
    const baseUrl = windowUrl[0];
    const referrer = window.location.href;
    console.log('fetchURL');
    console.log(fetchURL);
    const myPost = {
      contentBeginIndex:0,
      productBeginIndex:24,
      beginIndex:24,
      orderBy:null,
      facetId:null,
      pageView:'list',
      resultType:'products',
      orderByContent:null,
      searchTerm:'samsung',
      facet:null,
      facetLimit:null,
      minPrice:null,
      maxPrice:null,
      pageSize:null,
      storeId:12761,
      catalogId:10001,
      langId:'-5',
      enableSKUListView:null,
      objectId:'_6_1120',
      requesttype:'ajax'
  };
    const searchResults = await fetch(fetchURL, {
      // @ts-ignore
      accept: 'application/json, text/plain, */*',
      referrer: referrer,
      referrerPolicy: 'no-referrer-when-downgrade',
      body: JSON.stringify(myPost),
      method: 'POST',
      mode: 'cors',
    });

    if (searchResults && searchResults.status === 404) {
      console.log('Product Not Found!!!!');
      return;
    }

    if (searchResults && searchResults.status === 200) {
      data = await searchResults.json();
      data.Data.Items.forEach((category) => {
        const row = addElementToDocumentOld('added_row', '');
        const name = category.Brand + ' ' + category.Name;
        const id = category.Sku;
        const image = category.ImageLinks;
        const price = category.CurrentPrice;
        image.forEach(element => {
          if (element.Rel === 'large') {
            const thumbnail = element.Uri;
            row.setAttribute('added_thumbnail', thumbnail);
          }
        });
        const prodUrl = baseUrl + 'product/' + id + '/details/';
        row.setAttribute('added_name', name);
        row.setAttribute('added_url', prodUrl);
        row.setAttribute('added_id', id);
        row.setAttribute('added_price', price);
      });
    }
    
    const priceText = getAllXpath("//input[contains(@id,'ProductInfoPrice_')]/@value", 'nodeValue').join('|');
    var priceTextValue = priceText.split('|');

    const manufacturerText = getAllXpath("//*[contains(@id,'ProductInfoBrand_')]/@value", 'nodeValue').join('|');
    var manufacturerTextValue = manufacturerText.split('|');

    const nameText = getAllXpath("//*[contains(@id,'ProductInfoName_')]/@value", 'nodeValue').join('|');
    var nameTextValue = nameText.split('|');

    const productURLText = getAllXpath("//*[contains(@id,'catalogEntry_img')]/@href", 'nodeValue').join('|');
    var productURLTextValue = productURLText.split('|');

    const thumbNailText = getAllXpath("//*[contains(@id,'catalogEntry_img')]/img/@src", 'nodeValue').join('|');
    var thumbNailTextValue = thumbNailText.split('|');

    const idPath = getAllXpath("//input[contains(@id,'comparebox_')]/@value", 'nodeValue').join('|');
    var myIdArr = idPath.split('|');
    for (var i = 0; i < myIdArr.length; i++) {
      try {
        addElementToDocumentOld('id', myIdArr[i]);
        addElementToDocumentOld('price', priceTextValue[i].replace(/,/g, '.'));
        addElementToDocumentOld('name', nameTextValue[i]);
        addElementToDocumentOld('manufacturer', manufacturerTextValue[i]);
        addElementToDocumentOld('productUrl', productURLTextValue[i]);
        addElementToDocumentOld('thumbnail', thumbNailTextValue[i]);
        addElementToDocumentOld('added-searchurl', url);
      } catch (err) {
        console.log('Error =>', err);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'coppel',
    transform,
    domain: 'coppel.com',
    zipcode: '',
  },
  implementation,
};