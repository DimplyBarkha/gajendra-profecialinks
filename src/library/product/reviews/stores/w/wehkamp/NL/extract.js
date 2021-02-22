async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;

  await context.evaluate(async () => {
    const json = JSON.parse(document.querySelector('#app > div.main > script').textContent);
    const id = json.sku;
    console.log(json);
    const url = `https://www.wehkamp.nl/service/product-components/api/reviews?artikelNummer=${id}&sortBy=DateSubmitted&sortOrder=Descending&take=100`;

    const { items } = await fetch(url).then(res => res.json());
    console.log(items);

    function addHiddenDiv (className, content, block) {
      const div = document.createElement('div');
      div.classList.add(className);
      div.innerText = content;
      div.style.display = 'none';
      block.appendChild(div);
    }

    if (items.length) {
      items.forEach(item => {
        const divMain = document.createElement('div');
        divMain.classList.add('review-card');
        document.body.appendChild(divMain);

        addHiddenDiv('helper-review-text', item['text'], divMain);
        addHiddenDiv('helper-review-title', item['title'], divMain);
        addHiddenDiv('helper-review-rating', item.rating, divMain);
        addHiddenDiv('helper-review-date', item.dateSubmitted, divMain);
        addHiddenDiv('helper-review-nickname', item.nickname, divMain);
        addHiddenDiv('helper-review-vote-count', item.positiveVoteCount, divMain);
        addHiddenDiv('helper-review-comments-count', item.comments.length, divMain);
        addHiddenDiv('helper-review-reviewedSku', item.productNumber, divMain);
        addHiddenDiv('helper-review-brand', json.brand['name'], divMain);
        addHiddenDiv('helper-review-name', json['name'], divMain);
        addHiddenDiv('helper-review-gtin', json.gtin13, divMain);
        addHiddenDiv('helper-review-aggregateRating', json['aggregateRating'].ratingValue.toFixed(1), divMain);
        addHiddenDiv('helper-review-sku', id, divMain);
        addHiddenDiv('helper-review-url', location.href, divMain);
      });
    }
  });
  return await context.extract(productReviews);
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'NL',
    store: 'wehkamp',
    transform: null,
    domain: 'wehkamp.nl',
    zipcode: '',
  },
  implementation,
};
