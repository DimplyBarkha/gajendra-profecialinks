const { transform } = require('./shared');
async function preExtraction (context, date, results) {
  async function addReviews (date = null) {
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
            console.log(jsonData[i]);
            if (
              jsonData[i][col[j]] &&
            (jsonData[i][col[j]] !== 'null' ||
              jsonData[i][col[j]] !== 'undefined')
            ) {
              if (typeof jsonData[i][col[j]] === 'object') {
                if (Array.isArray(jsonData[i][col[j]])) {
                  jsonData[i][col[j]].forEach((data) => {
                    const tr = document.createElement('tr');
                    if (typeof data === 'object') {
                      data = JSON.stringify(data);
                    }
                    tr.innerText = data;
                    td.append(tr);
                  });
                } else {
                  td.innerHTML = JSON.stringify(jsonData[i][col[j]]);
                }
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
        container.setAttribute('id', 'product-review-api');
        container.setAttribute('style', 'overflow:scroll;float: left');
        container.innerHTML = '';
        container.appendChild(table);
        document.querySelector('[data-zone-name="footer"]').append(container);
      }
    }
    async function getProductId (link) {
      link = link || window.location.href;
      const res = await fetch(link);
      const html = await res.text();
      return html.match(/"productId":(\d+)/)[1];
    }
    const productId = await getProductId(document.querySelector('[data-tid="f72d1588"] a').href);
    const sk = state.user.sk;
    const API =
    'https://pokupki.market.yandex.ru/api/resolve/?r=beton/src/resolvers/reviews:resolveFullProductReviews';
    let page = 0;
    const body = {
      params: [
        {
          productId: productId,
          pager: {
            pageNum: page,
            showAll: true,
          },
          sort: {
            by: 'date',
            type: 'desc',
          },
          filter: {
            gradeValue: null,
          },
        },
      ],
      path: window.location.pathname,
    };
    let data = [];
    let paginate = true;
    do {
      const res = await fetch(API, {
        headers: {
          sk,
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      });
      body.params[0].pager.pageNum = ++page;
      const json = await res.json();
      const reviews = json.results[0].data.collections.review;
      if (Object.values(reviews).length === 0) {
        paginate = false;
      } else {
        const users = json.results[0].data.collections.user;
        const comments = json.results[0].data.collections.comment;
        for (const review in reviews) {
          if (reviews[review].userUid) {
            reviews[review].userName = users[reviews[review].userUid].displayName;
          }
        }
        for (const comment in comments) {
          if (comments[comment].userId) {
            comments[comment].userName =
            users[comments[comment].userId].displayName;
          }
          const reviewId = comments[comment].rootCommentId.match(/\d+$/)[0];
          console.log(reviewId);
          reviews[reviewId].commentName = comments[comment].userName || '';
          reviews[reviewId].commentUpdateTime =
          comments[comment].updateTime.formatted || '';
          reviews[reviewId].commentBody = comments[comment].body || '';
        }
        data = data.concat(Object.values(reviews));
        const filteredData = data.filter(review => {
          const reviewDate = review.created ? new Date(review.created).setHours(0, 0, 0, 0) : new Date(new Date(date)).setHours(0, 0, 0, 0);
          const dateLimit = new Date(new Date(date)).setHours(0, 0, 0, 0);
          return (reviewDate - dateLimit) >= 0;
        });
        if (filteredData.length < data.length) {
          paginate = false;
          data = filteredData;
        }
      }
    } while (paginate);
    console.log(data);
    generateDynamicTable(data);
  }
  await context.evaluate(addReviews, date);
}
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    transform,
    preExtraction,
    mergeType: null,
    filterReviews: true,
    domain: 'beru.ru',
    zipcode: '',
  },
};
