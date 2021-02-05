const { transform } = require('../../../../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails,goto } = dependencies;
  function addDynamicTable(jsonData) {
    function generateDynamicTable(jsonData) {
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
  async function getData() {
    async function getBasicData(api) {
      const response = await goto(api);
      const json = await response.json();
      return json.basic;
    }
    const dataSelected = JSON.parse(document.body.innerText);
    const data = [dataSelected];
    const selectedId = dataSelected.USItemId;
    const basicApi = window.location.href.replace(/storeId=\d+/, 'storeId=5334');
    if (!dataSelected.basic.image) {
      dataSelected.basic = await getBasicData(basicApi);
    }
    if (dataSelected.variantProducts) {
      const ids = Object.values(dataSelected.variantProducts).map(elm => elm.usItemId).filter(elm => elm !== selectedId);
      for (const id of ids) {
        const response = await fetch(window.location.href.replace(/products\/[^\?]+/, `products/${id}`));
        const json = await response.json();
        if (!json.basic.image) {
          json.basic = await getBasicData(basicApi.replace(/storeId=\d+/, 'storeId=5334'));
        }
        data.push(json);
      }
    }
    return data;
  }

  console.log('Hello');
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'walmarttogo',
    transform,
    domain: 'walmarttogo.api',
  },
  implementation,
};
