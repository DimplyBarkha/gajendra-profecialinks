
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
      let dataStr = JSON.stringify(data);
      console.log('INSIDE OF CLEANUP');
      dataStr = dataStr
          .replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
          .replace(/&amp;nbsp;/g, ' ')
          .replace(/&amp;#160/g, ' ')
          .replace(/\\u00A0/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .replace(/"\s{1,}/g, '"')
          .replace(/\s{1,}"/g, '"')
          .replace(/^ +| +$|( )+/g, ' ')
          // eslint-disable-next-line no-control-regex
          .replace(/[^\x00-\x7F]/g, '');

      return JSON.parse(dataStr);
  };
  for (const { group } of data) {
      for (let row of group) {
          if (row.specifications) {
              const formattedSpecifications = row.specifications
                  .map((item, index) =>
                      index == row.specifications.length - 1 ? item.text : !item.text.includes('\n') ? item.text + ' || ' : '',
                  )
                  .join('');
              row.specifications = [];
              row.specifications.push({ text: '' });
              row.specifications[0].text = formattedSpecifications;
          }
          if (row.additionalDescBulletInfo) {
              const formattedAdditionalDescBulletInfo = row.additionalDescBulletInfo
                  .map((item, index) => index == row.additionalDescBulletInfo.length - 1 ? item.text : item.text + ' || ')
                  .join('');
              row.additionalDescBulletInfo = [];
              row.additionalDescBulletInfo.push({ text: '' });
              row.additionalDescBulletInfo[0].text = formattedAdditionalDescBulletInfo;
          }
          if (row.description) {
              const formattedDescription = row.description
                  .map((item, index) => index == row.description.length - 1 ? item.text : item.text + ' || ')
                  .join('');
              row.description = [];
              row.description.push({ text: '' });
              row.description[0].text = formattedDescription;
          }
          if (row.availabilityText) {
              row.availabilityText.forEach((str) => {
                  str.text =
                      str.text == 'Añadir al carrito' ? 'In Stock' : 'Out of Stock';
              });
          }
          if (row.aggregateRating) {
              row.aggregateRating.forEach((str) => {
                  str.text = str.text.split(' ');
                  str.text = str.text[0];
              });
          }
          if (row.weightNet) {
              if (row.weightNet.length > 1) {
                  const formattedWeightNet = row.weightNet.map((item, index) => {
                      if (!item.text.includes('\n')) {
                          return {
                              text: item.text.split(/[ :]+/).splice(1).join(' '),
                              xpath: item.xpath,
                          };
                      }
                  });
                  row.weightNet = [];
                  // row.weightNet = formattedWeightNet.splice(
                  //   formattedWeightNet.length - 1
                  // );
                  const finalWeight = formattedWeightNet[0] ? formattedWeightNet[0] : formattedWeightNet[1];
                  row.weightNet.push(finalWeight);
              } else {
                  const formattedWeightNet = row.weightNet.map((item, index) => {
                      return {
                          text: item.text.split(/[ :]+/).splice(1).join(' '),
                          xpath: item.xpath,
                      };
                  });
                  row.weightNet = [];
                  row.weightNet = formattedWeightNet;
              }
          }
          if (row.color) {
              if (row.color.length > 1) {
                  const formattedcolor = row.color.map((item, index) => {
                      if (!item.text.includes('\n')) {
                          const color = item.text.split(' ');
                          return {
                              text: color[color.length - 1],
                              xpath: item.xpath,
                          };
                      }
                  });
                  row.color = [];
                  // row.color = formattedcolor.splice(
                  //   formattedcolor.length - 1
                  // );
                  row.color.push(formattedcolor[formattedcolor.length - 1]);
              } else {
                  const formattedcolor = row.color.map((item, index) => {
                      const color = item.text.split(' ');
                      return {
                          text: color[color.length - 1],
                          xpath: item.xpath,
                      };
                  });
                  row.color = [];
                  row.color = formattedcolor;
              }
          }
          if (row.warranty) {
              const warranty = row.warranty
                  .map((str) => {
                      return str.text.replace(/\n/g, ' ');
                  })
                  .join('');

              row.warranty[0].text = warranty;
          }
          if (row.mpc) {
              const mpc = row.mpc[0].text.split(',');
              let mpn = '';
              mpc
                  .forEach((str) => {
                      if (str.includes('mpn')) {
                          mpn = str;
                      }
                  });
              mpn = mpn.split(':').splice(1).join('');
              row.mpc[0].text = mpn.replace(/"/g, '');
          }
          if (row.eangtin) {
              const eangtin = row.eangtin[0].text.split(',');
              let ean = '';
              eangtin
                  .forEach((str) => {
                      if (str.includes('ean')) {
                          ean = str;
                      }
                  });
              ean = ean.split(':').splice(1).join('');
              ean = ean.replace(/"/g, '');
              if (ean.length == 12) {
                  row.gtin = [{ text: ean }];
              } else {
                  row.eangtin[0].text = ean;
              }
          }
          if (row.availabilityText) {
              const availabilityText = row.availabilityText
                  .map((str) => {
                      return str.text.replace(/\n/g, ' ');
                  })
                  .join('');

              row.availabilityText[0].text = availabilityText;
          }
          // .split("¿").splice(0).join("")
          if (row.shippingInfo) {
              const shippingInfo = row.shippingInfo
                  .map((str) => {
                      str = str.text.replace(/\n/g, ' ');
                      str = str.split('¿');
                      return str[0];
                  })
                  .join('');

              row.shippingInfo[0].text = shippingInfo;
          }
          if (row.image) {
              row.image.forEach((str) => {
                  str.text = 'https:' + str.text;
              });
          }
          if (row.alternateImages) {
              row.alternateImages.forEach((str) => {
                  str.text = 'https:' + str.text.replace(/w-85-85/g, 'w-530-530');
              });
          }
          if (row.ratingCount) {
              const ratingCount = row.ratingCount[0].text.split(' ');
              if (ratingCount.length == 1) {
                  row.ratingCount[0].text = '0';
              } else {
                  row.ratingCount[0].text = ratingCount[0];
              }
          }
          if (row.category) {
              row.category.shift();
              // const category = row.category
              //   .map((category, index) => {
              //     return row.category.length - 1 == index
              //       ? category.text
              //       : category.text + " > ";
              //   })
              //   .join("");

              // row.category = [];
              // row.category.push({ text: "" });
              // row.category[0].text = category.split(">").splice(1).join(">");
          }
          row = cleanUp(row);
      }
  }
  return data;
};

module.exports = { transform };