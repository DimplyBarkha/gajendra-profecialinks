
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ').trim();
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += `${item.text.replace('View larger', '')
            .replace(/\r\n|\r|\n/g, ' ')
            .replace(/&amp;nbsp;/g, ' ')
            .replace(/&amp;#160/g, ' ')
            .replace(/\u00A0/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .replace(/"\s{1,}/g, '"')
            .replace(/\s{1,}"/g, '"')
            .replace(/^ +| +$|( )+/g, ' ').trim()} `;
        });
        row.manufacturerDescription = [
          {
            text: text.trim(),
          },
        ];
      }

      if (row.otherSellersName && row.otherSellersName2) {
        row.otherSellersName = row.otherSellersName2.concat(row.otherSellersName);
      }

      if (!row.otherSellersName && row.otherSellersName2) {
        row.otherSellersName = row.otherSellersName2;
        row.otherSellersPrice = row.price;
        row.otherSellersPrime = [
          {
            text: 'supersaver',
          },
        ];
      }

      if (row.otherSellersName) {
        for (const item of row.otherSellersName) {
          if (item.text.match(/amazon/ig)) {
            row.lbb = [
              {
                text: 'YES',
              },
            ];
            break;
          }
        }
      }

      if (row.lbb && row.lbb[0].text === 'NO') {
        delete row.lbbPrice;
      }

      if (row.otherSellersShipping2) {
        for (const item of row.otherSellersShipping2) {
          if (item.text.toLowerCase().includes('free')) {
            item.text = '0.00';
          } else if (item.text.match(/\$([^\s]+)/)) {
            item.text = item.text.match(/\$([^\s]+)/)[1];
          }
        }
      } else if (row.otherSellersName) {
        let text = '';
        row.otherSellersName.forEach(item => {
          text += '0.00|';
        });
        row.otherSellersShipping2 = [
          {
            text: text.slice(0, -1),
          },
        ];
      }

      if (row.weightGross) {
        for (const item of row.weightGross) {
          if (item.text.match(/.+\(/g)) {
            item.text = item.text.replace('(', '').trim();
          }
        }
      }

      if (row.otherSellersPrime) {
        for (const item of row.otherSellersPrime) {
          if (item.text.includes('Details') | item.text.includes('supersaver')) {
            item.text = 'YES';
          } else {
            item.text = 'NO';
          }
        }
      }

      if (row.videos) {
        let doesVideoExist = false;
        for (const item of row.videos) {
          if (item.text.includes('.hls.m3u8')) {
            doesVideoExist = true;
            item.text = item.text.replace('.hls.m3u8', '.mp4.480.mp4');
          }
          if (item.text.includes('videos') && item.text.match(/"url":"([^"]*)/g)) {
            doesVideoExist = true;
            const videoLinks = item.text.match(/"url":"([^"]*)/g);
            const videoLengths = item.text.match(/"durationTimestamp":"([^"]*)/g);
            let urlText = '';
            let lengthText = '';
            videoLinks.forEach(url => {
              urlText += `${url.replace('"url":"', '')} | `;
            });
            videoLengths.forEach(len => {
              lengthText += `${len.replace('"durationTimestamp":"', '')} | `;
            });
            row.videos = [
              {
                text: urlText.slice(0, -3),
              },
            ];
            row.videoLength = [
              {
                text: lengthText.slice(0, -3),
              },
            ];
            break;
          }
        }

        if (!doesVideoExist) {
          delete row.videos;
          delete row.videoLength;
        }
      }

      if (row.largeImageCount) {
        for (const item of row.largeImageCount) {
          item.text = item.text.trim().match(/hiRes":"/g) ? item.text.trim().match(/hiRes":"/g).length : 0;
        }
      }

      if (row.brandText) {
        for (const item of row.brandText) {
          if (item.text.match(/Visit the (.+)/g)) {
            item.text = item.text.match(/Visit the (.+)/g)[0].replace('Visit the ', '').replace('Store', '');
          }
          if (item.text.match(/Brand: (.+)/g)) {
            item.text = item.text.match(/Brand: (.+)/g)[0].replace('Brand: ', '');
          }
        }
      }

      if (row.variantCount) {
        row.variantCount.forEach(item => {
          if (item.text === '0') {
            row.variantCount = [
              {
                text: '1',
              },
            ];
          }
        });
      }

      if (row.variantAsins) {
        let text = '';
        row.variantAsins.forEach(item => {
          text += `${item.text} | `;
        });
        row.variantAsins = [
          {
            text: text.slice(0, -3),
          },
        ];
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `|| ${item.text} `;
        });
        row.description = [
          {
            text: `${text.trim()}`,
          },
        ];
      }

      if (row.prodDescription) {
        let text = '';
        row.prodDescription.forEach(item => {
          text += `${item.text} `;
        });
        row.prodDescription = [
          {
            text: `${text.trim()}`,
          },
        ];
      }

      if (row.description && row.prodDescription) {
        row.description = [
          {
            text: `${row.description[0].text} ${row.prodDescription[0].text}`,
          },
        ];
        row.additionalDescBulletInfo = [
          {
            text: `${row.description[0].text} ${row.prodDescription[0].text}`,
          },
        ];
        delete row.prodDescription;
      }

      if (!row.listPrice && row.price) {
        row.listPrice = row.price;
      }

      if (row.asin2) {
        if (!row.asin) {
          row.asin = row.asin2;
        }
        delete row.asin2;
      }
    }
  }
  return data;
};

module.exports = { transform };
