
// /**
//  *
//  * @param {ImportIO.Group[]} data
//  * @returns {ImportIO.Group[]}
//  */
// const transform = (data) => {
//   for (const { group } of data) {
//     for (const row of group) {
//       if (row.category) {
//         if (row.category[0].text === 'Home') {
//           row.category.shift();
//         }
//       }
//       if (row.additionalDescBulletInfo) {
//         var addText = '';
//         row.additionalDescBulletInfo.forEach((ele) => {
//           addText += ' || ' + ele.text;
//         });
//         row.additionalDescBulletInfo = [
//           {
//             text: addText.trim(),
//           },
//         ];
//       }
//       if (row.warranty) {
//         var text = '';
//         row.warranty.forEach((ele) => {
//           text += ' ' + ele.text;
//         });
//         row.warranty = [{
//           text: text.trim(),
//         }];
//       }
//       if (row.alternateImages) {
//         if (row.alternateImages[0].text === row.image[0].text) {
//           row.alternateImages.shift();
//         }
//       }
//       if (row.secondaryImageTotal && row.alternateImages) {
//         row.secondaryImageTotal = [
//           {
//             text: row.alternateImages.length,
//           },
//         ];
//       }
//       if (row.specifications) {
//         let text = '';
//         for (var i = 0; i < row.specifications.length; i = i + 2) {
//           text += row.specifications[i].text + ': ' + row.specifications[i + 1].text + ' || ';
//         }
//         row.specifications = [{
//           text: (text.slice(0, -3)).trim(),
//         }];
//       }
//       if (row.shippingInfo) {
//         if (row.shippingInfo[0].text && row.shippingInfo[1].text) {
//           row.shippingInfo = [
//             {
//               text: row.shippingInfo[0].text + row.shippingInfo[1].text,
//             },
//           ];
//         }
//       }
//       if (row.Image360Present) {
//         var imagesVal = row.Image360Present[0].text === 'No' ? row.Image360Present[0].text : 'Yes';
//         row.Image360Present = [
//           {
//             text: imagesVal,
//           },
//         ];
//       }
//       if (row.ratingCount) {
//         row.ratingCount[0].text = row.ratingCount[0].text.replace(/\D/g, '');
//       }
//       if (row.availabilityText) {
//         row.availabilityText[0].text = row.availabilityText[0].text.includes('In stock') ? 'In Stock' : row.availabilityText[0].text;
//       }
//       if (row.manufacturerDescription) {
//         var manuDesc = '';
//         var flag = false;
//         row.manufacturerDescription.forEach((ele) => {
//           if (ele.text.includes('{\"duration\"')) {
//             flag = true;
//           } else {
//             manuDesc += '' + ele.text.replace(/\n/g, '');
//           }
//         });
//         if (flag) {
//           delete row.manufacturerDescription;
//         } else {
//           row.manufacturerDescription = [
//             {
//               text: manuDesc.trim(),
//             }];
//         }
//       }
//     }
//   }
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
//   data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
//     el.text = clean(el.text);
//   }))));

//   return data;
// };

// module.exports = { transform };
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
  for (const { group } of data) {
    for (const row of group) {
      // if (row.manufacturerDescription) {
      //   row.manufacturerDescription.forEach(item => {
      //     'https://www.newegg.com/p/pl?d={id}';
      //   });
      // }

      if (!row.inTheBoxText && row.inTheBoxTextFromP) {
        let inTheBoxText = row.inTheBoxTextFromP[0].text;
        inTheBoxText = inTheBoxText.replace('In the box:', '');
        inTheBoxText = inTheBoxText.replace(/,/g, ' || ');
        row.inTheBoxText = [{ text: inTheBoxText }];
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(image => {
          if (!image.text.startsWith('https')) {
            image.text = `https:${image.text}`;
          }
        });
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
