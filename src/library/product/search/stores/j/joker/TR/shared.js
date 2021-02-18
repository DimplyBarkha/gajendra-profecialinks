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
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));

      // if(row.gtin8){
      //   var product=row.gtin8[0].text;
      //   regEx = /\(([^)]+)\)/;
      //   var  regexMatch = regEx.exec(product);

      //   var productDetails = JSON.parse(regexMatch[1]);
      //   //var prodgtin=JSON.parse(productDetails);
      //   row.gtin8=[{text:productDetails.gtin8}];
      // }

      //  if (row.ratingCount) {
      //     var product = row.ratingCount[0].text;
      //     // console.log(product);
      //     var processProduct= JSON.parse(product)
      //     console.log(processProduct.aggregateRating.ratingCount);
      //     row.ratingCount = [
      //       { text: processProduct.aggregateRating.ratingCount },
      //     ];

      // }
       
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};
module.exports = { transform };