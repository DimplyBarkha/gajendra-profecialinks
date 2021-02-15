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
    var findJsonData = (startString, endString) => {
      let scriptContent = group[0].id[0].text;
      const startIdx = scriptContent.indexOf(startString);
      const endIdx = scriptContent.indexOf(endString);
      let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
      jsonStr = jsonStr.trim();
      return JSON.parse(jsonStr);
    };
    const dataObj = findJsonData('(', ');')
    const data = dataObj.ecommerce.impressions;
    let itr = 0;
    for (const row of group) {

      if (row.name) {
        let text = '';
        row.name.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.name = [{ text }];
      }

      if (data[itr].id.includes('conf_')) {
        row.id = [{ text: data[itr].id.replace('conf_', '') }];
      } else if (data[itr].id.includes('conf')) {
        row.id = [{ text: data[itr].id.replace('conf', '') }];
      } else {
        row.id = [{ text: data[itr].id }];
      }
      itr += 1;

      // if (!row.id) {
      //   if (row.productUrl) {
      //     let urlForID = row.productUrl[0].text ? row.productUrl[0].text : '';
      //     let pattForId = /(?<=-)\d+(?=\.html)/;
      //     // /\W([\d]+).html/;
      //     // let idArray = pattForId.exec(urlForID);
      //     // let newID = idArray[1] ? idArray[1] : '';
      //     let result = urlForID.match(pattForId)
      //     if(result){
      //       let newID = result;
      //       row.id = [{text: newID }];
      //     }

      //   }

      // }


      if (row.id) {
        rankCounter += 1;
        if (!row.sponsored) {
          orgRankCounter += 1;
          row.rankOrganic = [{ text: orgRankCounter }];
        }
        // console.log('rankCounter ==', rankCounter);
        row.rank = [{ text: rankCounter }];
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      }

    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};
module.exports = { transform };
