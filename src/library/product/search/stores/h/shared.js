
module.exports.implementation = async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  const { domain, country } = parameters;
  const { keywords } = inputs;

  async function loadResources () {
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
  }

  await loadResources();

  try {
    // await stall(100000);
    await context.waitForSelector('hts-product-info[id*=sponsored]', {}, { timeout: 50000 });
    // await context.waitForXpath('//hts-product-info[contains(@id,"sponsored-")]', {}, { timeout: 50000 });
  } catch (error) {
    console.log(error);
  }

  await context.evaluate(async (domain, country, keywords) => {
    // function stall (ms) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve();
    //     }, ms);
    //   });
    // }
    // await stall(100000);
    // let scrollTop = 500;
    // while (true) {
    //   window.scroll(0, scrollTop);
    //   await stall(1000);
    //   scrollTop += 500;
    //   if (scrollTop === 10000) {
    //     break;
    //   }
    // }

    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };

    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
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

    const storeMapping = {
      412: 'FCE4123709',
      66: 'C217228',
      61: 'AAA03995',
    };

    let data = {};
    var pageNo = 1;
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('pageNo');
    var pathname = new URL(window.location.href).pathname;
    var searchKey = pathname.split('search/')[1];
    var storeId = window.location.href.substring(window.location.href.lastIndexOf('store/') + 6, window.location.href.lastIndexOf('/search'));
    console.log('storeId');
    console.log(storeId);
    if (myParam) {
      pageNo = parseInt(myParam);
    }
    const fetchURL = `https://www.harristeeter.com/shop/api/v1/el/stores/${storeMapping[storeId]}/products/search?Q=${(searchKey)}&WithCart=false&UserId=0dcfda6e-b8cc-442a-a25c-b9c6b9824afd&Page=${pageNo}&Limit=20&IsMember=false&AllowAlcohol=true&Sort=Relevance`;
    const windowUrl = window.location.href.split('search');
    const baseUrl = windowUrl[0];
    const referrer = window.location.href;
    console.log('fetchURL');
    console.log(fetchURL);
    const searchResults = await fetch(fetchURL, {
      // @ts-ignore
      accept: 'application/json, text/plain, */*',
      referrer: referrer,
      referrerPolicy: 'no-referrer-when-downgrade',
      body: null,
      method: 'GET',
      mode: 'cors',
    });

    if (searchResults && searchResults.status === 404) {
      console.log('Product Not Found!!!!');
      return;
    }

    if (searchResults && searchResults.status === 200) {
      data = await searchResults.json();
      data.Data.Items.forEach((category) => {
        const row = addElementToDocument('added_row', '');
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

    if (pageNo === 1) {
      const sponsoredProductName = getAllXpath("//hts-product-info[contains(@id,'sponsored-')]//span[@class='product-name']//text()", 'nodeValue').join(',');
      const sponsoredProductNameList = sponsoredProductName.split(',');
      console.log('sponsoredProductName');
      console.log(sponsoredProductName);

      const sponsoredProductPrice = getAllXpath("//hts-product-info[contains(@id,'sponsored-')]//span[@class='product-price']//text()", 'nodeValue').join(',');
      const sponsoredProductPriceList = sponsoredProductPrice.split(',');

      const sponsoredProductUrl = getAllXpath("//hts-product-info[contains(@id,'sponsored-')]//a[contains(@onclick, 'url:')]/@href", 'nodeValue').join(',');
      const sponsoredProductUrlList = sponsoredProductUrl.split(',');

      for (var count = 0; count < sponsoredProductNameList.length; count++) {
        const row = addElementToDocument('added_row', '');
        row.setAttribute('added_name', sponsoredProductNameList[count]);
        row.setAttribute('added_price', sponsoredProductPriceList[count]);
        row.setAttribute('added_url', sponsoredProductUrlList[count]);
      }

      // hts-product-info[contains(@id,"sponsored-")]//span[@class='product-name']//text()
      // hts-product-info[contains(@id,"sponsored-")]//span[@class='product-price']//text()
      // hts-product-info[contains(@id,"sponsored-")]//a[contains(@onclick, 'url:')]/@href
      // id
      // image
    }
  }, domain, country, keywords);

  return await context.extract(productDetails, { transform: parameters.transform });
};
