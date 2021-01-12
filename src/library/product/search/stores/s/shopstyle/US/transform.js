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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  const state = context.getState();
  const orgRankCounter = state.orgRankCounter || 0;
  const rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];

  for (const { group } of data) {
    for (const row of group) {
      if (row.product) {
        const productObj = JSON.parse(row.product[0].text);

        const setRow = (fieldName, keyName) => {
          if (productObj[keyName]) {
            row[fieldName] = [{ text: productObj[keyName] }];
          }
        };

        setRow('ProductId', 'id');
        setRow('Price', 'priceLabel');
        setRow('Style', 'unbrandedName');
        setRow('NumberHearts', 'favoriteCount');
        setRow('DetailUrl', 'clickUrl');

        if (productObj.salePriceLabel) {
          setRow('SalePrice', 'salePriceLabel');
        }

        row.Brand = [{ text: productObj.brand.name }];
        row.StoreName = [{ text: productObj.retailer.name }];
        row.ImageUrl = [{ text: productObj.image.sizes.Best.url }];
        row.Availability = [{ text: true }];

        setRow('PageRank', 'rank');
        setRow('VariantSize', 'mySize');

        delete row.product;
      }

      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};

module.exports = {
  transform,
};
