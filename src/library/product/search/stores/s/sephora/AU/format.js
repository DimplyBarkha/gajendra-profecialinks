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
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      // if(row.price){
      //   let text = row.price[0].text;
      //   let splits = text.split(" ");
      //   row.price[0].text = splits[0];
      // }

      // if(row.productUrl){
      //   let text = row.productUrl[0].text;
      //   let split = text.split("?");
      //   if(split[0]){
      //     let url = split[0];
      //     if(url){
      //       row.productUrl[0].text = url;
      //     }
      //   }
      // }

      if (row.name) {
        const names = [];
        row.name.forEach(n => {
          names.push(n.text);
        });
        const nameJoin = names.join(' - ');
        row.name = [{ text: nameJoin }];
      }

      if (row.aggregateRating2) {
        const text = row.aggregateRating2[0].text;
        if (text === 'No stars') {
          row.aggregateRating2[0].text = '0';
        } else {
          const split = text.split(' ');
          if (split[0]) {
            const rating = parseFloat(split[0]);
            const adjusted = rating.toPrecision(2);

            if (adjusted) {
              row.aggregateRating2[0].text = adjusted;
            }
          }
        }
      }

      // if(row.reviewCount){
      //   let text = row.reviewCount[0].text;
      //   let splits = text.split(" ");
      //   if(splits[0]){
      //     let joins = splits[0];

      //     if(joins){
      //       row.reviewCount[0].text = joins;
      //     }
      //   }
      // }

      // if(row.thumbnail){
      //   let text = row.thumbnail[0].text;
      //   let joins;
      //   if(!text.includes(".com")){
      //     joins = "https://www.sephora.com" + text;
      //   } else {
      //     joins = text;
      //   }

      //   if(joins){
      //     row.thumbnail[0].text = joins;
      //   }
      // }

      if (row.productUrl) {
        const text = row.productUrl[0].text;
        const splits = text.split(' ');
        let joins;
        if (splits[0]) {
          if (!splits[0].includes('.com')) {
            joins = 'https://www.sephora.com.au' + splits[0];
            row.productUrl[0].text = joins;
          }
        } else {
          joins = splits[0];
          row.productUrl[0].text = joins;
        }
      }

      // if(row.id){
      //   if(row.id[0].text){
      //     let text = row.id[0].text

      //     let sNum = text.match(/(s[0-9]+)/g);

      //     if(sNum){
      //       console.log(sNum[0])

      //       let num = sNum[0].match(/[0-9]+/g);
      //       if(num[0]){
      //         // console.log("TEXT HERE" + " " + num[0]);
      //         // row.id[0].text = text

      //         row.id[0].text = num[0];
      //       }
      //     }
      //   }
      // }

      if (row.id && row.id[0]) {
        productCodes.push(row.id[0].text);
        rankCounter += 1;
        if (!row.sponsored) {
          orgRankCounter += 1;
          row.rankOrganic = [{ text: orgRankCounter }];
        }
        row.rank = [{ text: rankCounter }];
      } else {
        row.id = [{ text: '' }];
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
module.exports = { transform };
