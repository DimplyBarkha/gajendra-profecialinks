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
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    const state = context.getState();
    const productCodes = state.productCodes || [];
    let rankCounter = state.rankCounter || 0;
    for (const { group } of data) {
      for (const row of group) {
        rankCounter = rankCounter + 1;
        row.rank = [{ text: rankCounter }];
        row.rankOrganic = [{ text: rankCounter }];
        context.setState({ rankCounter });
      }
    }
    for (const { group } of data) {
      for (const row of group) {
        // rankCounter = rankCounter + 1;
        // row.rank = [{ text: rankCounter }];
        // row.rankOrganic = [{ text: rankCounter }];
        // context.setState({ rankCounter });
  
        if (row.price) {
          row.price.forEach(priceItem => {
            priceItem.text = priceItem.text.replace(/(^\d*)(.*?)(\d+)/gm, '$2$1,$3');
          });
        }
        if (row.reviewCount) {
          row.reviewCount.forEach(reviewCountItem => {
            reviewCountItem.text = reviewCountItem.text.replace(/[^\d]/gm, '');
          });
        }
        /**
           * aggregateRating2 and searchUrl coming multiple times as per page number (if page number is three then same value comes three times)
           * Hence adding transform to keep it as a single object
           */
        if (row.aggregateRating2 && row.aggregateRating2.length > 1) {
          row.aggregateRating2 = [row.aggregateRating2[0]];
        }
        if (row.searchUrl && row.searchUrl.length > 1) {
          row.searchUrl = [row.searchUrl[0]];
        }
  
        if (row.aggregateRating2) {
          row.aggregateRating2.forEach(aggregateRating2Item => {
            aggregateRating2Item.text = aggregateRating2Item.text.replace(/\./gm, ',');
            if (aggregateRating2Item.text === 0 || aggregateRating2Item.text === '0') {
              aggregateRating2Item.text = '';
            }
          });
        }
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      }
    }
  
    context.setState({ productCodes });
    return data;
  };
  module.exports = { transform };
  