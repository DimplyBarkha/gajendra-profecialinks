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
        if (row.helpful[0].raw === 'Eine Person fand diese Informationen hilfreich') {
          row.helpful[0].text = 1;
          delete row.helpful[0].error;
          row.helpful[0].value = 1;
        } else if (help.includes('Personen fanden diese Informationen hilfreich')) {
          row.helpful[0].text = help.replace('Personen fanden diese Informationen hilfreich', '');
        }
      }
      if (row.sourceUrl) {
        const sourceUrl = row.sourceUrl[0].text;
        row.sourceUrl[0].text = 'https://www.amazon.de' + sourceUrl;
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

  if (!onReviewsPage) {
    // await context.clickAndWaitForNavigation('a[data-hook="see-all-reviews-link-foot"]', { timeout: 15000 }, { waitUntil: 'load' });
    const reviewSuffix = await context.evaluate(() => {
      return document.querySelector('a[data-hook="see-all-reviews-link-foot"]').getAttribute('href');
    });
    await context.goto(`https://www.amazon.de${reviewSuffix}`, { timeout: 20000, waitUntil: 'load' });
  }

  const data = await context.extract(productReviews, { transform });

  return data;
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    domain: 'amazon.de',
    zipcode: "''",
  },
  implementation,
};
