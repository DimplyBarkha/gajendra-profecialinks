const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'walmartQA',
    transform,
    domain: 'walmart.com',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ parentInput }, { country, domain, transform }, context, dependencies) => {
    async function addQA () {
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
              if (jsonData[i][col[j]] && (jsonData[i][col[j]] !== 'null' || jsonData[i][col[j]] !== 'undefined')) {
                if (typeof jsonData[i][col[j]] === 'object') {
                  jsonData[i][col[j]].forEach(data => {
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
          container.setAttribute('id', 'product-qa-api');
          container.setAttribute('style', 'overflow:auto;float: left');
          container.innerHTML = '';
          container.appendChild(table);
          document.querySelector('.js-footer-content').append(container);
        }
      }
      const exists = document.querySelector('#questions-answers div[class="ReviewList-content"]');
      if (!exists) return false;

      const maxPageEl = document.querySelector('#questions-answers [class="paginator-list"] > li:last-child > button > span');
      const maxPage = maxPageEl ? Number(maxPageEl.innerText) : 1;
      let data = [];
      const productId = window.location.pathname.match(/[^\/]+$/)[0]
      for (let page = 1; page <= maxPage; page++) {
        const body = {
          productId,
          paginationContext: {
            sort: 'totalAnswerCount',
            page: page,
          },
        };
        const response = await fetch('https://www.walmart.com/terra-firma/fetch?rgs=QUESTIONS_FIELD', {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        });
        const json = await response.json();
        const tempData = json.payload.questionAnswersField.questionDetails;
        data = data.concat(tempData);
      }
      generateDynamicTable(data);
    }
    await context.evaluate(addQA);
    return await context.extract(dependencies.productDetails, { transform });
  },
};
