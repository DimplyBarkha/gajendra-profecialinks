
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
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

  const state = context.getState();
  let productdata = state.productdata || 0;
  if (!Object.keys(productdata).length) {
    const firstrow = data[0].group[0];
    context.setState({ productdata: firstrow });
    productdata = firstrow;
  }
  const { brand, sourceUrl, mediaURL, pageTitle, productRange, productFamily, colour, flavour, sku } = productdata;
  for (const { group } of data) {
    for (const row of group) {
      try {
        const datum = Object.assign(row, { brand, sourceUrl, mediaURL, pageTitle, productRange, productFamily, colour, flavour, sku });
        Object.keys(datum).forEach(header => {
          if (row[header]) {
            row[header].forEach(el => {
              el.text = clean(el.text);
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  return data;
};

module.exports = { transform };
