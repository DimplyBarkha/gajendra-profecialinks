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
        const div = document.createElement('div');
        div.classList.add('review-card');
        document.body.appendChild(div);

        addHiddenDiv('helper-review-text', item.text, div);
        addHiddenDiv('helper-review-title', item.title, div);
        addHiddenDiv('helper-review-rating', item.rating, div);
        addHiddenDiv('helper-review-date', item.dateSubmitted, div);
        addHiddenDiv('helper-review-nickname', item.nickname, div);
        addHiddenDiv('helper-review-vote-count', item.positiveVoteCount, div);
        addHiddenDiv('helper-review-comments-count', item.comments.length, div);
        addHiddenDiv('helper-review-reviewedSku', item.productNumber, div);
        addHiddenDiv('helper-review-brand', json.brand.name, div);
        addHiddenDiv('helper-review-name', json.name, div);
        addHiddenDiv('helper-review-gtin', json.gtin13, div);
        addHiddenDiv('helper-review-aggregateRating', json.aggregateRating.ratingValue.toFixed(1), div);
        addHiddenDiv('helper-review-sku', id, div);
        addHiddenDiv('helper-review-url', location.href, div);
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
