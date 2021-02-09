const transform = (data, context) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();
  for (const { group } of data) {
    for (const row of group) {
      if (row.sku) {
        let skuCode = row.sku[0].text;
        skuCode = skuCode.split('/');
        row.sku[0].text = skuCode[skuCode.length - 1];
      }
      if (row.rating) {
        let rating = row.rating[0].text;
        rating = rating.split(' ');
        row.rating[0].text = rating[0].replace(',', '.');
      }
      if (row.aggregateRating) {
        let aggregateRating = row.aggregateRating[0].text;
        aggregateRating = aggregateRating.split(' ');
        row.aggregateRating[0].text = aggregateRating[0].replace(',', '.');
      }
      if (row.helpful) {
        const help = row.helpful[0].text;
        if (row.helpful[0].raw === 'Une personne a trouvé cela utile') {
          row.helpful[0].text = 1;
          delete row.helpful[0].error;
          row.helpful[0].value = 1;
        } else if (help.includes('personnes ont trouvé cela utile')) {
          row.helpful[0].text = help.replace('personnes ont trouvé cela utile', '');
        }
      }
      if (row.sourceUrl) {
        const sourceUrl = row.sourceUrl[0].text;
        row.sourceUrl[0].text = 'https://www.amazon.fr' + sourceUrl;
      }

      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  const { transform } = parameters;

  const onReviewsPage = await context.evaluate(() => {
    return window.location.href.includes('/product-reviews');
  });

  if (onReviewsPage) {
    await context.waitForSelector('li[class="a-last"]', { timeout: 7000 })
      .catch(() => console.log('On last page'));
  }

  const prodObj = await context.evaluate(() => {
    try {
      if (document.querySelector('div#wayfinding-breadcrumbs_container a')) {
        let productFamily = '';
        let productRange = '';
        const nav = document.querySelectorAll('div#wayfinding-breadcrumbs_container a');
        nav.forEach(item => {
          productFamily += ' > ' + item.innerText;
        });
        productFamily = (productFamily[1] === '>') ? productFamily.substr(2).trim() : productFamily.trim();
        productRange = document.querySelector('div#wayfinding-breadcrumbs_container li:last-child a').innerText;
        return { productFamily: productFamily, productRange: productRange };
      }
    } catch (e) {
      console.log('error while getting breadcrumb');
    }
  });

  if (!onReviewsPage) {
    const reviewSuffix = await context.evaluate(() => {
      let reviewURL = '';
      if (document.querySelector('a[data-hook="see-all-reviews-link-foot"]')) {
        reviewURL = document.querySelector('a[data-hook="see-all-reviews-link-foot"]').getAttribute('href');
      }
      return reviewURL;
    });
    if (reviewSuffix) {
      await context.goto(`https://www.amazon.fr${reviewSuffix}`, { timeout: 20000, waitUntil: 'load' });
    } else {
      await context.evaluate(() => {
        const newDiv = document.createElement('div');
        newDiv.id = 'no_reviews';
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      });
    }
  }

  await context.evaluate((prodObj) => {
    try {
      if (prodObj && prodObj.productFamily) {
        const newDiv = document.createElement('div');
        newDiv.id = 'custom_details';
        newDiv.setAttribute('productFamily', prodObj.productFamily);
        newDiv.setAttribute('productRange', prodObj.productRange);
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    } catch (e) {
      console.log('error with breadcrumb');
    }
  }, prodObj);

  const data = await context.extract(productReviews, { transform });

  return data;
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    transform,
    domain: 'amazon.fr',
    zipcode: "''",
  },
  dependencies: {
    productReviews: 'extraction:product/reviews/stores/${store[0:1]}/${store}/${country}/extract',
    goto: 'action:navigation/goto',
  },
  implementation,
};
