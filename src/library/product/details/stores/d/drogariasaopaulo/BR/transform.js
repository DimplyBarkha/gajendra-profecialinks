/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // Default transform function
  const clean = (text) =>
    text
      .toString()
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
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) =>
        row[header].forEach((el) => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );

  for (const { group } of data) {
    for (const row of group) {
      try {
        var product;
        var regEx;
        var regexMatch;
        var productDetails;
        if (row.nameExtended) {
          product = row.brandText[0].text;
          regEx = /\(([^)]+)\)/;
          regexMatch = regEx.exec(product);

          productDetails = JSON.parse(regexMatch[1]);
          if (
            productDetails.productName.includes(productDetails.productBrandName)
          ) {
            row.nameExtended = [{ text: productDetails.productName }];
          } else {
            row.nameExtended = [
              {
                text: `${productDetails.productBrandName} ${productDetails.productName}`,
              },
            ];
          }
        }
        if (row.brandText) {
          product = row.brandText[0].text;
          regEx = /\(([^)]+)\)/;
          regexMatch = regEx.exec(product);

          productDetails = JSON.parse(regexMatch[1]);
          row.brandText = [{ text: productDetails.productBrandName }];
        }
        if (row.variantId) {
          console.log('Start');
          product = row.variantId[0].text;
          console.log('product');
          console.log(product);
          regEx = /\(([^)]+)\)/;
          regexMatch = regEx.exec(product);
          console.log('regexMatch');
          console.log(regexMatch);

          productDetails = JSON.parse(regexMatch[1]);
          console.log('productDetails');
          console.log('variantId');
          console.log(productDetails.productId);
          row.variantId = [{ text: productDetails.productId }];
        }
        if (row.price) {
          const price = row.price[0].text;

          var fprice = price.slice(3);
          console.log(fprice);

          row.price = [{ text: fprice }];
        }
        if (row.listPrice) {
          const listPrice = row.listPrice[0].text;

          var flistPrice = listPrice.slice(3);
          console.log(flistPrice);

          row.price = [{ text: flistPrice }];
        }
        // if (row.gtin) {
        //   product = row.gtin[0].text;
        //   regEx = /\(([^)]+)\)/;
        //   regexMatch = regEx.exec(product);

        //   productDetails = JSON.parse(regexMatch[1]);
        //   row.gtin = [
        //     { text: productDetails.productEans },
        //   ];
        // }
        // if (row.weightNet) {
        //   product = row.weightNet[0].text;
        //   regEx = /\{([^]+)\}/;
        //   regexMatch = regEx.exec(product);

        //   productDetails = JSON.parse(regexMatch[0]);
        //   row.weightNet = [
        //     { text: productDetails.skus[0].measures.weight },
        //   ];
        // }
        if (row.availabilityText) {
          row.availabilityText = [
            {
              text:
                row.availabilityText[0].text === 'true'
                  ? 'In Stock'
                  : 'Out Of Stock',
            },
          ];
        }
      } catch (exception) {
        console.log('Error in transform', exception);
      }
    }
  }
  return data;
};

module.exports = { transform };
