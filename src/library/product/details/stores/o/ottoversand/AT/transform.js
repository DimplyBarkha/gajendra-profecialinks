/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // Default transform function
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

  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.priceCurrency) {
          const temppriceCurrency = row.priceCurrency[0].text.split(':');
          row.priceCurrency = [{ text: temppriceCurrency[1].replace('"', '').replace('"', '').replace(',', '').trim() }];
        }

        if (row.price) {
          const tempPrice = row.price[0].text.split(':');
          row.price = [{ text: tempPrice[1].replace('"', '').replace('.', ',').trim() }, { text: row.priceCurrency[0].text }];
        }

        if (row.aggregateRating) {
          const tempaggregateRating = row.aggregateRating[0].text.split(':');
          row.aggregateRating = [{ text: tempaggregateRating[1].replace('"', '').replace('.', ',').trim() }];
        }

        if (row.variantId) {
          const tempsku = row.sku[0].text.split(':');
          row.variantId = [{ text: tempsku[1].replace('"', '').replace('"', '').replace(',', '').trim() }];
        }

        if (row.sku) {
          const tempsku = row.sku[0].text.split(':');
          row.sku = [{ text: tempsku[1].replace('"', '').replace('"', '').replace(',', '').trim() }];
        }

        if (row.brandText) {
          const tempbrandText = row.brandText[1].text.split(':');
          row.brandText = [{ text: tempbrandText[1].replace('"', '').replace('"', '').replace(',', '').trim() }];
        }

        if (row.variants) {
          let artNo = '';
          let i = 1;
          row.variants.forEach(item => {
            if (item.text.indexOf(':') !== -1) {
              var temp = item.text.split(':');
              if (row.variants.length === 1) {
                artNo += temp[1].trim();
              } else {
                if (row.variants.length === i) {
                  artNo += temp[1].trim();
                } else {
                  artNo += temp[1].trim() + ' | ';
                }
              }
            } else {
              if (row.variants.length === 1) {
                artNo += item.text.trim();
              } else {
                if (row.variants.length === i) {
                  artNo += item.text.trim();
                } else {
                  artNo += item.text.trim() + ' | ';
                }
              }
            }
            i = i + 1;
          });

          // row.variants.forEach(item => {
          //   if(item.text.indexOf('Art.-Nr.:') == -1){
          //     newText += artNo+'-'+item.text+" || ";
          // }});
          // newText = newText.substring(0,newText.length-3);
          row.variants = [{ text: artNo }];
        }

        if (row.firstVariant) {
          let artNo = '';
          let i = 0;
          row.firstVariant.forEach(item => {
            if (item.text.indexOf(':') !== -1) {
              var temp = item.text.split(':');
              if (row.variants.length === 1) {
                artNo += temp[1].trim();
              } else {
                if (row.variants.length === i) {
                  artNo += temp[1].trim();
                } else {
                  artNo += temp[1].trim() + ' | ';
                }
              }
              i = i + 1;
            }
          });

          row.firstVariant = [{ text: artNo }];
        }

        let newText1 = '';
        if (row.additionalDescBulletInfo) {
          let newText = '';
          let itemp = 1;
          row.additionalDescBulletInfo.forEach(item => {
            if (itemp !== row.additionalDescBulletInfo.length) {
              item.text = item.text + ' || ';
            }
            newText += `${item.text.replace(/\n|&dash;|\r/g, ' || ')}`;
            itemp = itemp + 1;
          });
          newText1 = newText.trim();
        }

        if (row.description) {
          let newText = '';
          let itemp = 1;
          row.description.forEach(item => {
            if (itemp !== row.description.length) {
              item.text = item.text + ' || ';
            }
            newText += `${item.text.replace(/\n|&dash;|\r/g, ' || ')}`;
            itemp = itemp + 1;
          });
          row.description = [{ text: newText1.trim() + newText.trim() }];
        }

        if (row.specifications) {
          let newText = '';
          let itemp = 1;
          row.specifications.forEach(item => {
            if (itemp !== row.specifications.length) {
              item.text = item.text + ' || ';
            }
            newText += `${item.text.replace(/\n|&dash;|\r/g, ' || ')}`;
            itemp = itemp + 1;
          });
          row.specifications = [{ text: newText.trim() }];
        }

        if (row.technicalInformationPdfPresent) {
          let newText = 'No';
          row.technicalInformationPdfPresent.forEach(item => {
            if (item.text.trim() > '0') {
              newText = 'Yes';
            }
          });
          row.technicalInformationPdfPresent = [{ text: newText }];
        }
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
