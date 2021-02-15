const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

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
    // console.log("table", jsonData);
    const container = document.createElement('div');
    container.setAttribute('id', 'added-table');
    container.setAttribute('style', 'overflow:auto');
    container.innerHTML = '';
    container.appendChild(table);
    document.body.innerHTML = '';
    document.body.append(container);
  }
  async function getData () {
    return [JSON.parse(document.body.innerText)];
  }
  async function addPageLinks () {
    async function getNextLink () {
      const query = {};
      window.location.search.split(/&/).forEach(elm => { query[elm.match(/^[^=]+/)[0]] = elm.match(/[^=]+$/)[0]; });
      let nextLink = 'stop';
      // @ts-ignore
      const totalCount = Number(document.querySelector('[class="totalCount"]').innerText);
      if (totalCount < (Number(query['?count']) * Number(query.page))) {
        return nextLink;
      }
      query.page = Number(query.page) + 1;
      query.offset = Number(query.offset) + Number(query['?count']);

      console.log(`offset:${query.offset}`)
      console.log(`page:${query.page}`)

      nextLink = 'https://www.walmart.com/grocery/v4/api/products/search' + Object.entries(query).map(elm => `${elm[0]}=${elm[1]}`).join('&');
      console.log('nextLink => ',nextLink);
      return nextLink;
    }
    const currentPage = window.location.href;
    const nextLink = await getNextLink();
    const cp = document.createElement('a');
    cp.id = 'currentPage';
    cp.href = currentPage;
    document.body.append(cp);
    if (nextLink !== 'stop') {
      let nextLinkEl = document.querySelector('a[id="nextLink"]');
      if (!nextLinkEl){
        const np = document.createElement('a');
        cp.id = 'nextLink';
        np.href = nextLink;
        document.body.append(np);
      } else {
        nextLinkEl.setAttribute('href',nextLink);
      }

    }
  }
  try {
    const data = await context.evaluate(getData);
    await context.evaluate(addDynamicTable, data);
  } catch (error) {
    console.log('Error adding data. Error: ', error);
  }
  try {
    // Add next link url
    await context.evaluate(addPageLinks);
  } catch (error) {
    console.log('Error adding links. Error: ', error);
  }
  return await context.extract(productDetails, { transform });
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
