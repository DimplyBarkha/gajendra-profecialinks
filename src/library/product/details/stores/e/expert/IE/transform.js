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
      try {
        if (row.gtin && row.gtin[0] && row.gtin[0].text) {
          let jsonObj = row.gtin[0].text;
          console.log(jsonObj);
          if (jsonObj.includes('https:')) {
            if (jsonObj.includes('&ean=')) {
              jsonObj = jsonObj.split('/ean/');
              jsonObj = jsonObj.length === 2 ? jsonObj[1] : '';
              jsonObj = jsonObj.split('?&ean=')[0];
              row.gtin[0].text = jsonObj;
              row.upc[0].text = jsonObj;
              row.eangtin[0].text = jsonObj;
            } else {
              row.gtin[0].text = '';
              row.upc[0].text = '';
              row.eangtin[0].text = '';
            }
          }
        }

        if (row.specifications) {
          const textArr = [];
          row.specifications.forEach(item => {
            textArr.push(item.text);
          });
          row.specifications = [
            {
              text: textArr.join(' || ').trim(),
            },
          ];
        }

        if (row.shippingDimensions) {
          const textArr = [];
          row.shippingDimensions.forEach(item => {
            textArr.push(item.text);
          });
          row.shippingDimensions = [
            {
              text: textArr.join(' '),
            },
          ];
        }

        if (row.manufacturerDescription) {
          const textArr = [];
          row.manufacturerDescription.forEach(item => {
            textArr.push(item.text);
          });
          row.manufacturerDescription = [
            {
              text: textArr.join(' '),
            },
          ];
        }

        if (row.promotion) {
          const textArr = [];
          row.promotion.forEach(item => {
            textArr.push(item.text);
          });
          row.promotion = [
            {
              text: textArr.join(' '),
            },
          ];
        }

        if (row.packaging) {
          const text = [];
          row.packaging.forEach(item => {
            if (item.text.length > 0) { text.push(item.text); }
          });
          if (text.length > 0) {
            row.packaging = [
              {
                text: text.join(' || ').trim(),
              },
            ];
          }
        }

        if (row.shippingInfo) {
          const text = [];
          row.shippingInfo.forEach(item => {
            if (item.text.length > 0) { text.push(item.text); }
          });
          if (text.length > 0) {
            row.shippingInfo = [
              {
                text: text.join(' || ').trim(),
              },
            ];
          }
        }

        if (row.alternateImages && row.alternateImages[0]) {
          if (row.alternateImages[0].text.includes('product/cache/')) {
            let mainPictureSrc = row.alternateImages[0].text.split('product/cache/');
            mainPictureSrc = mainPictureSrc.length === 2 ? mainPictureSrc[1] : '';
            mainPictureSrc = mainPictureSrc.length ? mainPictureSrc.split('/')[0] : '';
            row.alternateImages = row.alternateImages.slice(1);
            if (row.alternateImages.length) {
              row.alternateImages.forEach(item => {
                item.text = item.text.replace(/(?<=product\/cache\/)(.*)(?=\/)/gm, mainPictureSrc);
              });
            }
          } else if (row.alternateImages[0].text.includes('produkte/bilder/')) {
            row.alternateImages.forEach(item => {
              item.text = 'https://www.expert.at/' + item.text;
            });
          } else if (row.alternateImages[0].text.startsWith('//media.flixcar.com')) {
            const image = [];
            row.alternateImages.forEach(item => {
              image.push(item.text);
              if (image.includes(item.text) === false) {
                item.text = 'https:' + item.text;
              }
            });
          }
        }

        if (row.manufacturerImages && row.manufacturerImages[0]) {
          row.manufacturerImages.forEach(item => {
            const imgUrl = item.text.split(' 200w, ')[0];
            if (!(item.text.includes('http'))) {
              item.text = 'https:' + imgUrl;
            }
          });
        }

        if (row.inTheBoxUrl && row.inTheBoxUrl[0]) {
          row.inTheBoxUrl.forEach(item => {
            if (item.text.includes(' 200w')) {
              const imgUrl = item.text.split(' 200w, ')[0];
              if (!(item.text.includes('http'))) {
                item.text = 'https:' + imgUrl;
              }
            }
          });
        }

        if (row.videos && row.videos[0]) {
          row.videos.forEach(item => {
            if (!(item.text.includes('http'))) {
              item.text = 'https://www.expert.at/' + item.text;
            }
            if (item.text.includes('ajax-loader.gif')) {
              item.text = item.text.replace('https://www.expert.de/static/images/loader/ajax-loader.gif', '');
            }
            if (item.text.includes('{"playlist":[{"file":')) {
              let JSONArr = item.text.match(/(\[.*?\])/gm) ? item.text.match(/(\[.*?\])/gm)[0] : '';
              JSONArr = JSONArr.length ? (JSONArr.startsWith('[') ? JSON.parse(JSONArr) : '') : '';
              if (JSONArr.length) {
                const videoItems = [];
                JSONArr.forEach(element => {
                  videoItems.push(element.file.slice(2));
                });
                item.text = videoItems.join(' || ');
              }
            }
          });
        }

        // if (row.price && row.price[0]) {
        //   row.price[0].text = row.price[0].text.replace('.', ',');
        // }

        // if (row.listPrice && row.listPrice[0]) {
        //   row.listPrice[0].text = row.listPrice[0].text.replace('.', ',');
        // }

        if (row.termsAndConditions && row.termsAndConditions[0]) {
          if (row.termsAndConditions[0].text.includes('Term')) {
            row.termsAndConditions[0].text = 'Yes';
          }
        }

        if (row.aggregateRating && row.aggregateRating[0]) {
          row.aggregateRating[0].text = row.aggregateRating[0].text.replace('.', ',');
        }

        if (row.aggregateRatingText && row.aggregateRatingText[0]) {
          row.aggregateRatingText[0].text = row.aggregateRatingText[0].text.replace('.', ',');
        }

        if (row.availabilityText && row.availabilityText[0]) {
          row.availabilityText[0].text = row.availabilityText[0].text.replace('true', 'In Stock');
          row.availabilityText[0].text = row.availabilityText[0].text.replace('false', 'Out of Stock');
        }

        if (row.technicalInformationPdfPresent && row.technicalInformationPdfPresent[0]) {
          row.technicalInformationPdfPresent[0].text = row.technicalInformationPdfPresent[0].text.replace('true', 'Yes');
          row.technicalInformationPdfPresent[0].text = row.technicalInformationPdfPresent[0].text.replace('false', 'No');
        }

        if (row.weightNet && row.weightNet[0]) {
          row.weightNet[0].text = row.weightNet[0].text.replace('Nettogewicht: ', '').replace('Weight:', '');
        }

        if (row.weightGross && row.weightGross[0]) {
          row.weightGross[0].text = row.weightGross[0].text.replace('Bruttogewicht: ', '');
        }

        if (row.color && row.color[0]) {
          row.color[0].text = row.color[0].text.replace('Farbe: ', '').replace('Colour:', '');
        }

        if (row.productOtherInformation && row.productOtherInformation[0]) {
          row.productOtherInformation.forEach(item => {
            item.text = item.text.replace('Mehr Details anzeigen', '');
          });
        }

        if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0]) {
          const text = row.additionalDescBulletInfo.map(item => {
            return item.text.replace(/(\d+)\sStern[e]*\s*✘\s*Filter entfernen/gm, '').replace(/(.+)✘(.+)/gm, '');
          }).join(' ');
          row.additionalDescBulletInfo = [{ text }];
        }

        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
