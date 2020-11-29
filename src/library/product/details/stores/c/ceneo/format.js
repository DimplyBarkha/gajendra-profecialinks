/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    console.log('INSIDE OF CLEANUP');
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
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
      try {
        if (row.manufacturerDescription) {
          let text = '';
          row.manufacturerDescription.forEach(item => {
            text += `${item.text.replace(/\n{0,}\s{1,}/g, ' ')}  `;
          });
          row.manufacturerDescription = [
            {
              text: text.slice(0, -2),
            },
          ];
        }

        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
            if (item.text.indexOf('https:') == -1) {
              item.text = `https:${item.text}`;
            }
          });
        }

        if (!row.brandText) {
          let text = row.name[0].text.split(' ')[0];
          row.brandText = [
            {
              text: text,
            },
          ];
        }

        if (row.variantInformation) {
          let text = '';
          row.variantInformation.forEach(item => {
            if (item.text.indexOf('https:') == -1) {
              text += `${item.text}|`;
            }
          });
          row.variantInformation = [
            {
              text: text.slice(0, -1),
            },
          ];
        }

        if (row.variants && row.variants.length > 0) {
          const arr = [];
          console.log('variants ::', row.sku[0]);
          arr.push(row.sku[0].text);
          row.variants.forEach(item => {
            arr.push(item.text.replace('/', ''));
          });
          if (arr.length > 1) {
            row.variants = [
              {
                text: arr.join('|'),
              },
            ];
          } else {
            row.variants = [
              {
                text: '',
              },
            ];
          }
        }

        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += `${item.text.replace(/\n{0,}\s{1,}/g, ' ')} || `;
          });
          row.specifications = [
            {
              text: text.slice(0, -4),
            },
          ];
        }

        if (row.description) {
          let text = '';
          if (row.description.length == 0) {
            if (row.myDescription && row.myDescription.length > 0) {
              let text = '';
                row.myDescription.forEach(item => {
                item.text = `${item.text.replace(/\n{0,}\s{1,}/g, ' ')}`;
                text = text + (text ? ' ' : '') + item.text;
              });
              row.description = [{ text }];
            } else {
              row.description = row.manufacturerDescription;
            }
          } else {
            row.description.forEach(item => {
              item.text = `${item.text.replace(/\n{0,}\s{1,}/g, ' ')}`;
              text = text + (text ? ' ' : '') + item.text;
            });
            row.description = [{ text }];
          }
        } else {
          if (row.myDescription) {
            let text = '';
              row.myDescription.forEach(item => {
              item.text = `${item.text.replace(/\n{0,}\s{1,}/g, ' ')}`;
              text = text + (text ? ' ' : '') + item.text;
            });
            row.description = [{ text }];
          } else {
            row.description = row.manufacturerDescription;
          }
        }   
        // if (row.description) {
        //   row.description.forEach(item => {
        //     item.text = `${item.text.replace(/\n{0,}\s{1,}/g, ' ')}`;
        //   });
        // } else {
        //   if (row.manufacturerDescription) {
        //     row.description = row.manufacturerDescription;
        //   } else {
        //     row.description = row.myDescription;
        //   }
        // }       
        row = cleanUp(row);
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  return data;
};
module.exports = { transform };
