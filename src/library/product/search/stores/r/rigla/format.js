/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    const cleanUp = (data, context) => {
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
      data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }))));
      return data;
    };
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
        // Object.keys(row).forEach(header => row[header].forEach(el => {
        //   el.text = clean(el.text);
        // }));
      }
  
      // let rank = 1;
      // for (const row of group) {

        // if (row.price1) {
        //   let price = '';
        //   row.price1.forEach(item => {
        //     price = item.text
        //   });
        //   if (row.price2) {
        //     row.price2.forEach(item => {
        //       price = price + item.text;
        //     });
        //   }
        //   row.price = [{ "text": price }];
        // }

        // if (row.productUrl) {
        //   row.productUrl.forEach(item => {
        //     item.text = "https://www.rigla.ru" + item.text;
        //   });
        // }

        // if (row.id) {
        //   row.id.forEach(item => {
        //     var myRegexp = /product\/(.+)/g;
        //     var match = myRegexp.exec(item.text);
        //     if (match) {
        //       if (match.length) {
        //         item.text = match[1].trim();
        //       } else {
        //         delete row.id;
        //       }
        //     }
        //   });
        // }
        // row.rank = row.rankOrganic =  [{ "text": rank }];
        // rank++;
      // }
    }
    context.setState({ rankCounter });
    context.setState({ orgRankCounter });
    context.setState({ productCodes });
    console.log(productCodes);
  
    return cleanUp(data);
  };
  
  module.exports = { transform };