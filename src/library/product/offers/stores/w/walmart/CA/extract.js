const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productOffers } = dependencies;
  async function addSellerInfo () {
    function generateDynamicTable (jsonData) {
      const dataLength = jsonData.length;

      if (dataLength > 0) {
        const table = document.createElement('table');
        table.style.width = '50%';
        table.setAttribute('border', '1');
        table.setAttribute('cellspacing', '0');
        table.setAttribute('cellpadding', '5');

        const col = [];
        for (let i = 0; i < dataLength; i++) {
          for (const key in jsonData[i]) {
            if (col.indexOf(key) === -1) {
              col.push(key);
            }
          }
        }
        const tHead = document.createElement('thead');
        const hRow = document.createElement('tr');

        for (let i = 0; i < col.length; i++) {
          const th = document.createElement('th');
          th.innerHTML = col[i];
          hRow.appendChild(th);
        }
        tHead.appendChild(hRow);
        table.appendChild(tHead);

        const tBody = document.createElement('tbody');

        for (let i = 0; i < dataLength; i++) {
          const bRow = document.createElement('tr');
          for (let j = 0; j < col.length; j++) {
            const td = document.createElement('td');
            td.setAttribute('class', col[j]);
            if (
              jsonData[i][col[j]] &&
              (jsonData[i][col[j]] !== 'null' ||
                jsonData[i][col[j]] !== 'undefined')
            ) {
              if (typeof jsonData[i][col[j]] === 'object') {
                jsonData[i][col[j]].forEach((data) => {
                  const tr = document.createElement('tr');
                  if (typeof data === 'object') {
                    data = JSON.stringify(data);
                  }
                  tr.innerText = data;
                  td.append(tr);
                });
              } else {
                td.innerHTML = jsonData[i][col[j]];
              }
            }
            bRow.appendChild(td);
          }
          tBody.appendChild(bRow);
        }
        table.appendChild(tBody);

        const container = document.createElement('div');
        container.setAttribute('id', 'product-offers-api');
        container.setAttribute('style', 'overflow:auto;float: left');
        container.innerHTML = '';
        container.appendChild(table);
        document.querySelector('footer').append(container);
      }
    }

    async function getStoreDetails () {
      const res = await fetch(window.location.href);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const json = JSON.parse(doc.querySelector('#tb-djs-wml-data').innerText);
      return { ...JSON.parse(json.ccm.common.features.defaultLPStore), correlationId: json.correlationId };
    }
    async function getPreloadState () {
      const res = await fetch(window.location.href);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const script = Array.from(doc.querySelectorAll('script')).find(elm => elm.innerText.includes('__PRELOADED_STATE__')).innerText;
      eval(script);
    }
    if (typeof __PRELOADED_STATE__ === 'undefined') {
      await getPreloadState();
      console.log(__PRELOADED_STATE__);
    }

    const variants = Object.values(__PRELOADED_STATE__.product.activeVariants);
    document.body.setAttribute('variants', variants.join(' | '));
    const storeDetails = await getStoreDetails();
    const productId = __PRELOADED_STATE__.product.item.id;
    const skuIds = [__PRELOADED_STATE__.product.activeSkuId];
    const experience = __PRELOADED_STATE__.common.experience;
    const correlationId = storeDetails.correlationId;
    const body = {
      fsa: storeDetails.postalCode.slice(0, 3),
      products: [{ productId, skuIds }],
      lang: 'en',
      pricingStoreId: storeDetails.localStoreId,
      fulfillmentStoreId: storeDetails.fulfillmentStoreId,
      experience,
    };

    async function getActiveOffers (body, correlationId) {
      const res = await fetch(
        'https://www.walmart.ca/api/product-page/v2/price-offer',
        {
          headers: {
            accept: 'application/json',
            'accept-language':
              'en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7,fi;q=0.6,sv;q=0.5,nb;q=0.4,ja;q=0.3,he;q=0.2,ro;q=0.1,pl;q=0.1,th;q=0.1,nl;q=0.1,pt;q=0.1',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            pragma: 'no-cache',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'wm_qos.correlation_id': correlationId,
          },
          referrer: window.location.href,
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: JSON.stringify(body),
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        },
      );
      console.log(res.status);
      const json = await res.json();
      const sellers = {};
      Object.values(json.offers)
        .filter((elm) => elm.gmAvailability === 'Available')
        .forEach((elm) => {
          sellers[elm.sellerId] = {
            sellerId: elm.sellerId,
            sellerName: elm.sellerInfo.en,
            price: elm.currentPrice || elm.pricePerUnit,
            stock: elm.availableQuantity,
            offerId: elm.offerId,
          };
        });
      return sellers;
    }
    const sellersInfo = await getActiveOffers(body, correlationId);
    async function addMoreDetails (sellersInfo, correlationId) {
      const sellerIds = Object.keys(sellersInfo).filter((elm) => elm !== '0');
      if (sellerIds.length === 0) return false;
      const res = await fetch(
        `https://www.walmart.ca/api/product-page/seller-info?lang=en&sellerIds=${sellerIds.join(',')}`,
        {
          headers: {
            accept: 'application/json',
            'accept-language': 'en-GB,en;q=0.9',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'wm_qos.correlation_id': correlationId,
          },
          referrer: window.location.href,
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: null,
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        },
      );

      const data = await res.json();
      for (const seller of sellerIds) {
        if (data[seller]) {
          sellersInfo[seller].email = data[seller].emailAddress || '';
        }
      }
      return true;
    }
    const noSellers = await addMoreDetails(sellersInfo, correlationId);

    async function addShippingDetails (
      sellersInfo,
      correlationId,
      skuId,
      postalCode,
    ) {
      console.log(sellersInfo);
      const sellers = Object.values(sellersInfo).map((seller) => {
        return {
          sellerId: seller.sellerId,
          itemTotal: seller.price,
          items: [
            {
              offerId: seller.offerId,
              skuId: skuId,
              quantity: 1,
              shipping: {
                options: ['EXPRESS', 'STANDARD'],
                type: 'PARCEL',
                isShipAlone: false,
              },
              isDigitalItem: false,
              isFreightItem: false,
            },
          ],
        };
      });
      const body = { sellers };
      console.log(body);
      const res = await fetch(
        `https://www.walmart.ca/api/product-page/est-delivery-info?postalCode=${postalCode}`,
        {
          headers: {
            accept: 'application/json',
            'accept-language':
              'en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7,fi;q=0.6,sv;q=0.5,nb;q=0.4,ja;q=0.3,he;q=0.2,ro;q=0.1,pl;q=0.1,th;q=0.1,nl;q=0.1,pt;q=0.1',
            'content-type': 'application/json',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'wm_qos.correlation_id': correlationId,
          },
          referrer: window.location.href,
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: JSON.stringify(body),
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        },
      );
      const data = await res.json();
      console.log(data);
      for (const seller of Object.keys(sellersInfo)) {
        if (data.sellers[seller]) {
          sellersInfo[seller].shippingCost =
            data.sellers[seller].shipMethods.STANDARD.charge.toString();
          sellersInfo[seller].deliveryDate =
            data.sellers[seller].shipMethods.STANDARD.minPromiseDeliveryDate.toString();
        }
      }
    }

    noSellers && await addShippingDetails(
      sellersInfo,
      correlationId,
      skuIds[0],
      storeDetails.postalCode,
    );
    generateDynamicTable(Object.values(sellersInfo));
  }
  await context.evaluate(addSellerInfo);
  return await context.extract(productOffers, { transform });
}
module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    transform,
    domain: 'walmart.ca',
    zipcode: '',
  },
  implementation,
};
