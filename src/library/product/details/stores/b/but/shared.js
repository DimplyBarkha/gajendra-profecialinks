
// /**
//  *
//  * @param {ImportIO.Group[]} data
//  * @returns {ImportIO.Group[]}
//  */
// const transform = (data) => {
//   const clean = text => text.toString()
//     .replace(/\r\n|\r|\n/g, ' ')
//     .replace(/&amp;nbsp;/g, ' ')
//     .replace(/&amp;#160/g, ' ')
//     .replace(/\u00A0/g, ' ')
//     .replace(/\s{2,}/g, ' ')
//     .replace(/"\s{1,}/g, '"')
//     .replace(/\s{1,}"/g, '"')
//     .replace(/^ +| +$|( )+/g, ' ')
//   // eslint-disable-next-line no-control-regex
//     .replace(/[\x00-\x1F]/g, '')
//     .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
//   for (const { group } of data) {
//     for (const row of group) {
//       if (row.specifications) {
//         let text = '';
//         row.specifications.forEach(item => {
//           text += `${item.text.replace(/\n/g, ' : ')}`;
//         });
//         row.specifications = [
//           {
//             text: text,
//           },
//         ];
//       }
//       if (row.description) {
//         // eslint-disable-next-line no-unused-vars
//         const text = '';
//         row.description.forEach(item => {
//           item.text = item.text.replace(/(\|\|\s){2,}/gm, '|| ').split('La marque vous informe')[0].split('<!--')[0];
//         });
//         row.description = [
//           {
//             text: row.description[0].text.slice(0, -1),
//           },
//         ];
//       }
//       if (row.additionalDescBulletInfo) {
//         let text = '';
//         row.additionalDescBulletInfo.forEach(item => {
//           text += `${item.text.replace(/\n \n/g, ' || ')} `;
//         });
//         row.additionalDescBulletInfo = [
//           {
//             text: text,
//           },
//         ];
//       }

//       if (row.aggregateRating) {
//         row.aggregateRating.forEach(item => {
//           item.text = item.text ? item.text.split('stars-').pop().replace('-', ',') : '';
//         });
//       }
//       // if (row.availabilityText) {
//       //   row.availabilityText.forEach(item => {
//       //     if ((item.text.includes('Disponible')) || (item.text.includes('Ajouter au panier'))) {
//       //       item.text = 'In Stock';
//       //     } else {
//       //       item.text = 'Out of Stock';
//       //     }
//       //   });
//       }
//       // if (row.category) {
//       //   row.category.pop();
//       // }
//       // if (row.ratingCount) {
//       //   row.ratingCount.forEach(item => {
//       //     item.text = item.text ? item.text.replace(/[()]/g, '') : '';
//       //   });
//       // }
//       if (row.variantCount) {
//         row.variantCount.forEach(item => {
//           if (item.text > 1) {
//             // eslint-disable-next-line no-self-assign
//             item.text = item.text;
//           } else {
//             item.text = 1;
//           }
//         });
//       }
//       if (row.brandText) {
//         row.brandText.forEach(item => {
//           item.text = item.text ? item.text.split(' ')[0] : '';
//         });
//       }
//       if (row.manufacturerDescription) {
//         row.manufacturerDescription.forEach(item => {
//           item.text = item.text ? item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim() : '';
//         });
//       }
//       if (row.videos) {
//         row.videos.forEach(item => {
//           item.text = item.text ? item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim() : '';
//         });
//       }
//       // if(row.video){
//       //   let textV;
//       //   row.video.forEach(item => {
//       //     textV += `${item.text} | `;
//       //   });
//       //   row.videos = [
//       //     {
//       //       text: textV,
//       //     },
//       //   ];
//       // }
//       if (row.manufacturerImages) {
//         row.manufacturerImages.forEach(item => {
//           if (item.text.includes('https:')) {
//             // eslint-disable-next-line no-self-assign
//             item.text = item.text;
//           } else {
//             item.text = 'https:' + item.text;
//           }
//         });
//       }
//       if (row.availabilityText) {
//         row.availabilityText.forEach(item => {
//           if (item.text.includes('Disponible')) {
//             item.text = 'In Stock';
//           } else {
//             item.text = 'Out of Stock';
//           }
//         });
//       }

//       if (row.imageAlt) {
//         row.imageAlt.forEach(item => {
//           if (item.text) {
//             // eslint-disable-next-line no-self-assign
//             item.text = item.text;
//           } else {
//             item.text = 'metaTag';
//           }
//         });
//       }
//       if (row.alternateImages) {
//         row.alternateImages.forEach(item => {
//           item.text = item.text.replace(/selectImage\('(.*)'\)/, '$1');
//         });
//         row.alternateImages.shift();
//       }
//     }
//   }
//   data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
//     el.text = clean(el.text);
//   }))));
//   return data;
// };

// module.exports = { transform };
