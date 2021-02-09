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

        setRow('sku', 'id');
        setRow('listPrice', 'priceLabel');
        setRow('name', 'unbrandedName');
        setRow('numberHearts', 'favoriteCount');
        setRow('productUrl', 'clickUrl');

        if (productObj.salePriceLabel) {
          setRow('price', 'salePriceLabel');
        } else {
          setRow('price','priceLabel');
        }

        if (productObj.brand) {
          row.brand = [{ text: productObj.brand.name }];
        }

        row.storeName = [{ text: productObj.retailer.name }];
        row.imageUrl = [{ text: productObj.image.sizes.Best.url }];
        row.image = [{ text: productObj.image.sizes.Best.url }];
        row.availability = [{ text: true }];

        setRow('pageRank', 'rank');
        setRow('variantSize', 'mySize');
        setRow('color', 'myColor');

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
