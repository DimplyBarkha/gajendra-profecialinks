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
      function addDynamicTable (jsonData, appendSelector) {
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
        container.setAttribute('style', 'height: 1000px;width: 100%;overflow:auto;float: left;position: relative;margin-left: -5px;');
        container.innerHTML = '';
        container.appendChild(table);
        document.querySelector(appendSelector).append(container);
      }
      const exists = document.querySelector('#questions-answers div[class="ReviewList-content"]');
      if (!exists) return false;

      const maxPageEl = document.querySelector('#questions-answers [class="paginator-list"] > li:last-child > button > span');
      const maxPage = maxPageEl ? Number(maxPageEl.innerText) : 1;
      let data = [];
      const productId = document.querySelector('link[rel="canonical"]').href.match(/[^/]+$/)[0];
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
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
          },
          referrer: window.location.href,
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: JSON.stringify(body),
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        });
        const json = await response.json();
        const tempData = json.payload.questionAnswersField.questionDetails;
        data = data.concat(tempData);
        await new Promise((r) => setTimeout(r, 2000));
      }
      addDynamicTable(data, '.js-footer-content');
      Array.from(document.querySelectorAll('[class="positiveVoteCount"],[class="negativeVoteCount"]'))
        .filter((elm) => !elm.innerText.length)
        .forEach((elm) => (elm.innerText = 0));
    }
    await context.evaluate(addQA);
    return await context.extract(dependencies.productDetails, { transform });
  },
};
