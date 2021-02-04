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

  for (const { group } of data) {
    for (const row of group) {
      if (row.shippingInfo) {
        const text = [];
        row.shippingInfo.forEach(item => {
          text.push(item.text);
        });
        row.shippingInfo = [
          {
            text: text.join(' '),
          },
        ];
      }
      if (row.promotion) {
        const text = [];
        row.promotion.forEach(item => {
          text.push(item.text);
        });
        row.promotion = [
          {
            text: text.join(' '),
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.includes('http') ? item.text : 'https:' + item.text;
        });
      }
      if (row.gtin) {
        if (row.gtin[0].text.includes('@context')) {
          let jsonStr = row.gtin[0].text;
          if (jsonStr.includes(' = ')) {
            jsonStr = jsonStr[1].split(' = ');
            jsonStr = jsonStr[1].slice(0, -1);
          }
          // jsonStr = jsonStr.length === 2 ? jsonStr[1].split(' = ') : [];
          // jsonStr = jsonStr.length === 2 ? jsonStr[1].slice(0, -1) : '';
          const jsonObj = jsonStr.length ? JSON.parse(jsonStr) : '';
          const ean = Object.keys(jsonObj).length ? (jsonObj.gtin13 ? jsonObj.gtin13 : '') : '';
          row.gtin = [
            {
              text: ean,
            },
          ];

          if (row.eangtin) {
            row.eangtin = [
              {
                text: ean,
              },
            ];
          }
        }
        if (row.gtin[0].text.includes('var product')) {
          let jsonStr = row.gtin[0].text;
          jsonStr = jsonStr.split('var product');
          jsonStr = jsonStr[1] ? jsonStr[1].split(' = ') : [];
          jsonStr = jsonStr.length === 2 ? jsonStr[1].slice(0, -1) : [];
          const jsonObj = jsonStr.length ? JSON.parse(jsonStr) : '';
          const ean = Object.keys(jsonObj).length ? (jsonObj.ean ? jsonObj.ean : '') : '';
          row.gtin = [
            {
              text: ean,
            },
          ];

          if (row.eangtin) {
            row.eangtin = [
              {
                text: ean,
              },
            ];
          }
        }
      }
      if (row.variants) {
        row.variants.forEach(item => {
          item.text = item.text.match(/(?<=-)(.*?)(?=\.)/gm) ? item.text.match(/(?<=-)(.*?)(?=\.)/gm)[0] : '';
          item.text = item.text.length ? (item.text.match(/[^-]+$/gm) ? item.text.match(/[^-]+$/gm)[0] : '') : '';
        });
      }
      if (row.firstVariant) {
        row.firstVariant.forEach(item => {
          item.text = item.text.match(/(?<=-)(.*?)(?=\.)/gm) ? item.text.match(/(?<=-)(.*?)(?=\.)/gm)[0] : '';
          item.text = item.text.length ? (item.text.match(/[^-]+$/gm) ? item.text.match(/[^-]+$/gm)[0] : '') : '';
        });
      }

      // if (row.manufacturerDescription) {
      //   let text = '';
      //   console.log(row.manufacturerDescription);
      //   row.manufacturerDescription.forEach(item => {
      //     text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim() + ' ';
      //   });
      //   row.manufacturerDescription = [
      //     {
      //       text: text,
      //     },
      //   ];
      // }
      // console.log('row.videos');
      // console.log(row.videos);

      // if (row.videos) {
      //   console.log(row.videos);
      //   row.videos.forEach(item => {
      //     item.text = (item.text.includes('http')) ? item.text : 'https:' + item.text;
      //   });
      // }

      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (!(item.text === 'In Stock' || item.text === 'Out of Stock')) {
            item.text = (item.text.includes('InStock')) ? 'In Stock' : 'Out of Stock';
          }
        });
      }

      if (row.legalDisclaimer) {
        const text = [];
        console.log(row.legalDisclaimer);
        row.legalDisclaimer.forEach(item => {
          text.push(item.text);
        });
        row.legalDisclaimer[0].text = text.join(' ');
      }

      if (row.variantInformation) {
        row.variantInformation[0].text = row.variantInformation[0].text.replace('Farbe: ', '');
      }

      if (row.specifications) {
        row.specifications[0].text = row.specifications[0].text.replace(/(:\n\s\n)/g, ': ').replace(/(\n\s*){2,}/g, ' || ');
        row.specifications = [{ text: clean(row.specifications[0].text.trim()) }];
      }
      if (row.productOtherInformation) {
        let text = '';
        row.productOtherInformation.forEach(item => {
          text = row.productOtherInformation.map(elm => elm.text).join(' | ');
        });
        row.productOtherInformation = [
          {
            text: text,
          },
        ];
      }

      if (row.aggregateRating) {
        row.aggregateRating[0].text = row.aggregateRating[0].text.replace('.', ',');
      }

      if (row.price) {
        row.price[0].text = row.price[0].text.replace('.', ',');
      }
      if (row.listPrice) {
        row.listPrice[0].text = row.listPrice[0].text.replace('.', ',');
      }

      if (row.inTheBoxUrl) {
        row.inTheBoxUrl.forEach(item => {
          item.text = item.text.startsWith('//') ? 'https:' + item.text : item.text;
        });
      }

      if (row.mpc) {
        console.log(row.mpc);
        console.log(row.mpc.length);
        if (row.mpc.length === 2) {
          row.mpc = row.mpc.slice(1);
        } else if (row.mpc.length === 1 && row.mpc[0].text.includes('(') && row.mpc[0].text.includes(')')) {
          const item = row.mpc[0];
          row.mpc[0].text = item.text.match(/(?<=\()(.*?)(?=\))/gm) ? item.text.match(/(?<=\()(.*?)(?=\))/gm)[0] : '';
        }
      }

      if (row.weightNet) {
        const text = row.weightNet[0].text.includes('/') ? row.weightNet[0].text.split('/')[1] : row.weightNet[0].text;
        row.weightNet = [{ text }];
      }

      if (row.manufacturerImages && row.manufacturerImages[0]) {
        if ((row.manufacturerImages[0].text.includes('media.flixcar.com') || row.manufacturerImages[0].text.includes('syndication.flix360.com')) && row.manufacturerImages[0].text.includes('1000w')) {
          row.manufacturerImages.forEach(item => {
            const img = item.text.split(' ')[0];
            const imgText = 'https:' + img;
            item.text = imgText;
          });
        }
        row.manufacturerImages.forEach(item => {
          if (!(item.text.startsWith('http'))) {
            const img = item.text;
            const imgText = 'https:' + img;
            item.text = imgText;
          }
        });

        if (row.manufacturerImages.length === 1) {
          const images = row.manufacturerImages[0].text.split(' | ');
          const image = [];
          for (let i = 0; i < images.length; i++) {
            if (images[i].includes('base64')) {
              continue;
            } else {
              if (!images[i].includes('http') && !images[i].includes('https')) {
                images[i] = 'https:' + images[i];
              }
              image.push(images[i]);
            }
            console.log(`IMAGE ${i}: ${images[i]}`);
          }
          const text = image.join(' | ');
          row.manufacturerImages = [{ text }];
        }

        row.manufacturerImages[0].text = row.manufacturerImages[0].text.includes('.gif') ? row.manufacturerImages[0].text.replace(/\.gif/g, '') : row.manufacturerImages[0].text;
      }
    }
  }

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach((header) => {
    console.log(header);
    row[header].forEach(el => {
      el.text = clean(el.text);
    });
  })));
  return data;
};

module.exports = { transform };
