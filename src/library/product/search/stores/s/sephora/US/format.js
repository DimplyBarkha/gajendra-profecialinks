/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // const cleanUp = (data, context) => {
  //   data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
  //     el.text = clean(el.text);
  //   }))));
  //   return data;
  // };
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '');


  for (const { group } of data) {
    for (let row of group) {
      try {
        if (row.weightGross) {
          let text = row.weightGross[0].text;
          let split = text.split(' ')
          row.weightGross = [{ text: `${split[0]}` }];
        }
        if(row.id){
          let text = row.id[0].text
          
          console.log("TEXT HERE" + " " + text)
          let sNum = text.match(/(s[0-9]+)/g)
          if(sNum[0]){
            row.id[0].text = sNum[0]
          }

        }



        // row = cleanUp(row);
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  // context.setState({ variantArray });
  return data;
};
module.exports = { transform };



// /**
//  *
//  * @param {ImportIO.Group[]} data
//  * @returns {ImportIO.Group[]}
//  */
// const transform = (data, context) => {
//   const clean = text => text.toString()
//     .replace(/\r\n|\r|\n/g, ' ')
//     .replace(/&amp;nbsp;/g, ' ')
//     .replace(/&amp;#160/g, ' ')
//     .replace(/\u00A0/g, ' ')
//     .replace(/\s{2,}/g, ' ')
//     .replace(/"\s{1,}/g, '"')
//     .replace(/\s{1,}"/g, '"')
//     .replace(/^ +| +$|( )+/g, ' ')
//     // eslint-disable-next-line no-control-regex
//     .replace(/[\x00-\x1F]/g, '')
//     .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
//   const state = context.getState();
//   let orgRankCounter = state.orgRankCounter || 0;
//   let rankCounter = state.rankCounter || 0;
//   const productCodes = state.productCodes || [];
//   for (const { group } of data) {
//     for (const row of group) {
//       try {
//         if(row.id){
//           let text = row.id[0].text
          
//           // console.log("TEXT HERE" + " " + text)
//           let sNum = text.match(/(s[0-9]+)/g)
//           if(sNum[0]){
//             row.id[0].text = sNum[0]
//           }

//         }
//         if (row.id && row.id[0] && productCodes.indexOf(row.id[0].text) === -1) {
//           productCodes.push(row.id[0].text);
//           rankCounter += 1;
//           if (!row.sponsored) {
//             orgRankCounter += 1;
//             row.rankOrganic = [{ text: orgRankCounter }];
//           }
//           row.rank = [{ text: rankCounter }];
//         } else {
//           row.id = [{ text: '' }];
//         }
//         Object.keys(row).forEach(header => row[header].forEach(el => {
//           el.text = clean(el.text);
//         }));
//       } catch {
//         console.log("ERROR in format.js")
//       }
//     }
//   }
//   context.setState({ rankCounter });
//   context.setState({ orgRankCounter });
//   context.setState({ productCodes });
//   console.log(productCodes);
//   return data;
// };
// module.exports = { transform };
