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
    for (const { group } of data) {
      for (const row of group) {
        if (row.productUrl && !row.productUrl[0].text.startsWith('http')) {
          row.productUrl[0].text = `https://www.elgiganten.se/${row.productUrl[0].text}`;
        }
  
        if (row.price) {
          row.price[0].text = row.price[0].text.replace(/(\s)+/g, '');
        }
        // if (row.aggregateRating2) {
        //   row.aggregateRating2.forEach(item => {
        //     item.text= item.text.replace(',','.');
        //   });
        // }
  
        rankCounter += 1;
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
        row.rank = [{ text: rankCounter }];
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      }
    }
    context.setState({ rankCounter });
    context.setState({ orgRankCounter });
    return data;
  };
  module.exports = { transform };