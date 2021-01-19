
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;


  await context.evaluate(async function() {

    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    function addHiddenDiv(el, id, text) {
      const div = document.createElement('div');
      div.innerHTML = text;
      div.classList.add(id);
      el.appendChild(div);
    }

    let scrollTop = 0;
    while(scrollTop < 10000) {
      scrollTop += 500;
      window.scroll(0, scrollTop);
      await stall(500);
    }

    document.querySelectorAll('.item').forEach(async (el, ind) => {
      if (el.querySelector('.normprice')) {
        addHiddenDiv(el, 'price', el.querySelector('.normprice').innerText);
      }
      if (el.querySelector('.name')) {
        addHiddenDiv(el, 'brand', el.querySelector('.name').innerText.split(' ')[0])
      }
      addHiddenDiv(el, 'rank', ind + 1);
      const itemId = el.querySelector('.sku-man').innerText.split(' ').pop();
      addHiddenDiv(el, 'itemId', itemId);
      if (el.querySelector('.name')) {
        addHiddenDiv(el, 'url', 'https://euronics.ie' + el.querySelector('.name').querySelector('a').getAttribute('href'));
      }

      if (el.querySelector('.product-thumb')) {
        addHiddenDiv(el, 'thumbnail', 'https://euronics.ie/' +  el.querySelector('.product-thumb').getAttribute('src'));
      }

      let ratingsAndReviews = await fetch(`https://mark.reevoo.com/reevoomark/product_summary?locale=en-IE&sku=${itemId}&trkref=ERI&callback=ReevooLib.Data.callbacks`)
        .then(response => response.text());

      if (ratingsAndReviews) {
         ratingsAndReviews = ratingsAndReviews.substring(ratingsAndReviews.indexOf('{')).replace('})', '}');
         const ratingsAndReviewsData = JSON.parse(ratingsAndReviews);
         addHiddenDiv(el, 'reviews', ratingsAndReviewsData.review_count);
         if (ratingsAndReviewsData.average_score) {
           addHiddenDiv(el, 'rating', (ratingsAndReviewsData.average_score / 2).toString().replace('.',','));
         }
      }

    });
    await stall(500);

  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'euronics',
    transform: null,
    domain: 'euronics.ie',
  },
  implementation,
};
