const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails, goto } = dependencies;
  function addDynamicTable (jsonData) {
    function generateDynamicTable (jsonData) {
      const dataLength = jsonData.length;

      jsonData = jsonData.map((elm) => {
        if (typeof elm !== 'object') {
          return { item: elm };
        }
        return elm;
      });
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
                td.innerHTML = jsonData[i][col[j]];
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
    document.body.innerHTML = '';
    document.body.append(container);
  }
  const pageUrl = await context.evaluate(() => window.location.href);
  async function getJsonData (url) {
    await goto({ url });
    const json = await context.evaluate(() => document.body.innerText);
    return JSON.parse(json);
  }
  async function getData () {
    const text = await context.evaluate(() => document.body.innerText);
    const dataSelected = JSON.parse(text);
    const data = [dataSelected];
    const selectedId = dataSelected.USItemId;
    const basicApi = pageUrl.replace(/storeId=\d+/, 'storeId=5334');
    if (!dataSelected.basic.image) {
      dataSelected.basic = (await getJsonData(basicApi)).basic;
    }
    if (dataSelected.variantProducts) {
      const ids = Object.values(dataSelected.variantProducts).map(elm => elm.usItemId).filter(elm => elm !== selectedId);
      for (const id of ids) {
        const json = await getJsonData(pageUrl.replace(/products\/[^\?]+/, `products/${id}`));
        if (!json.basic.image) {
          json.basic = (await getJsonData(basicApi.replace(/storeId=\d+/, 'storeId=5334'))).basic;
        }
        data.push(json);
      }
    }
    return data;
  }
  async function getStoreDetails () {
    console.log('LOCATION:', pageUrl);
    let zipcode = pageUrl.match(/zipcode=(\d+)/) && pageUrl.match(/zipcode=(\d+)/)[1];
    const storeId = pageUrl.match(/storeId=(\d+)/) && pageUrl.match(/storeId=(\d+)/)[1] || '5334';
    const json = await getJsonData(`https://www.walmart.com/grocery/v3/api/store/${storeId}`);
    const storeName = json.accessPointList.find(elm => elm.fulfillmentType === 'INSTORE_PICKUP').name.match(/^[^#]+/)[0].trim();
    if (!zipcode) {
      zipcode = json.address.postalCode.slice(0, 5);
    }
    return { zipcode, storeId, storeName };
  }
  try {
    const data = await getData();
    const storeData = await getStoreDetails();
    await context.evaluate(addDynamicTable, data);
    await context.evaluate(({ zipcode, storeId, storeName }) => {
      document.body.setAttribute('storeName', storeName);
      document.body.setAttribute('zipcode', zipcode);
      document.body.setAttribute('storeId', storeId);
    }, storeData);
    // Adding pipes to bullets, ideally should not be done in extractor level.
    await context.evaluate(() => {
      Array.from(document.querySelectorAll('td.description li,td.shortDescription li')).forEach(li => li.textContent = '|| ' + li.textContent);
    });
  } catch (error) {
    console.log('Error adding details. Error: ', error);
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'walmarttogo',
    transform,
    domain: 'walmarttogo.api',
  },
  dependencies: {
    goto: 'action:navigation/goto',
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
