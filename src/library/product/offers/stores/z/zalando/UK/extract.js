const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  // @FIX: Issue with using require(), so added function here.
  async function addDynamicTable (jsonData, appendSelector) {
    function generateDynamicTable (jsonData) {
      const dataLength = jsonData.length;

      if (dataLength > 0) {
        const table = document.createElement('table');
        table.style.width = '100%';
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
        tHead.setAttribute('bgcolor', '#CCC4F5');
        tHead.style.color = 'black';
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
            table.style.padding = '5px';
            table.style.margin = '5px auto';
            td.setAttribute('class', col[j]);
            if (
              jsonData[i][col[j]] &&
              (jsonData[i][col[j]] !== 'null' ||
                jsonData[i][col[j]] !== 'undefined')
            ) {
              if (typeof jsonData[i][col[j]] === 'object') {
                if (Array.isArray(jsonData[i][col[j]])) {
                  const table = generateDynamicTable(jsonData[i][col[j]]);
                  table && td.append(table);
                } else {
                  const table = generateDynamicTable([jsonData[i][col[j]]]);
                  table && td.append(table);
                }
              } else {
                td.innerText = jsonData[i][col[j]];
              }
            }
            bRow.appendChild(td);
            bRow.style.padding = '5px';
          }
          tBody.appendChild(bRow);
        }
        table.appendChild(tBody);
        return table;
      }
    }

    const table = generateDynamicTable(jsonData);
    const container = document.createElement('div');
    container.setAttribute('id', 'added-table');
    container.setAttribute('style', 'overflow:auto');
    container.innerHTML = '';
    container.appendChild(table);
    document.querySelector(appendSelector).append(container);
  }

  async function getData () {
    async function getPartnerDetails (partnerId) {
      async function getJsonObject () {
        const API = window.location.href;
        const res = await fetch(API);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return Array.from(doc.querySelectorAll('script')).find((elm) =>
          elm.innerText.includes('deliveryOptions'),
        ).innerText;
      }

      const json = await getJsonObject();
      const partnerUrl = 'https://en.zalando.de/checkout/partner/' + partnerId;
      const partnerNameRegex = new RegExp(
        `"text":"([^"]+)","isHighlighted":[^:]+,"uri":"${partnerUrl}`,
      );
      if (json.match(partnerNameRegex)) {
        return json.match(partnerNameRegex)[1];
      }
      return '';
    }
    const jsonData = JSON.parse(
      document
        .querySelector('[id="z-vegas-pdp-props"]')
        .innerText.match(/(\[{.+}\])\]>$/)[1],
    );
    const {
      id,
      name,
      reviewsCount,
      roundedAverageStarRating,
    } = jsonData[0].model.articleInfo;
    let image = '';
    try {
      image = jsonData[0].model.articleInfo.media.images[0].sources.detail;
    } catch (err) {
      console.log('err getting image');
    }
    let brand = '';
    try {
      brand = jsonData[0].model.articleInfo.brand.name;
    } catch (err) {
      console.log('err getting brand');
    }
    const units = jsonData[0].model.articleInfo.units;
    for (const unit of units) {
      unit.merchantName = await getPartnerDetails(unit.merchantId);
    }
    return [
      {
        productId: id,
        name,
        reviewsCount,
        roundedAverageStarRating,
        image,
        brand,
        units,
      },
    ];
  }
  const { transform } = parameters;
  const { productOffers } = dependencies;
  const data = await context.evaluate(getData);
  await context.evaluate(addDynamicTable, data, 'footer');
  return await context.extract(productOffers, { transform });
}
module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'UK',
    store: 'zalando',
    transform,
    domain: 'zalando.co.uk',
    zipcode: '',
  },
  implementation,
};
