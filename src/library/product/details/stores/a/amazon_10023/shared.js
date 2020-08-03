/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
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

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.nameExtended) {
        let text = '';
        row.nameExtended.forEach(item => {
          text += `${item.text.replace('Amazon.com:', '').replace(': Prime Pantry', '')}`;
        });
        row.nameExtended = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.name) {
        let text = '';
        row.name.forEach(item => {
          text += `${item.text.replace('Amazon.com:', '').replace(': Prime Pantry', '')}`;
        });
        row.name = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.imageAlt) {
        let text = '';
        row.imageAlt.forEach(item => {
          text += `${item.text.replace('&nbsp;', '')}`;
        });
        row.imageAlt = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.description || row.descriptionBottom) {
        let text = '';
        const description = row.description;
        description && description.forEach(item => {
          text += ` || ${item.text.replace(/\n \n/g, '')}`;
        });
        text = text.trim();
        let descriptionBottom = [];
        if (row.descriptionBottom) {
          descriptionBottom = row.descriptionBottom;
        }
        descriptionBottom = [text, ...descriptionBottom.map(({ text }) => text)];
        row.description = [
          {
            text: cleanUp(descriptionBottom.join(text ? ' | ' : '')),
          },
        ];
      }
      if (row.variantAsins) {
        let text = '';
        row.variantAsins.forEach(item => {
          text += `${item.text.replace(/\n \n/g, '')} | `;
        });
        row.variantAsins = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variantInformation) {
        const variantInformation = row.variantInformation.reverse();
        let text = '';
        variantInformation.forEach(item => {
          text += `${item.text.trim()} || `;
        });
        row.variantInformation = [
          {
            text: cleanUp(text.slice(0, -4)),
          },
        ];
      }
      if (row.availabilityText) {
        let text = '';
        row.availabilityText.forEach(item => {
          text += item.text.trim();
        });
        row.availabilityText = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.weightGross) {
        let text = '';
        row.weightGross.forEach(item => {
          text += item.text.trim();
        });
        row.weightGross = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.metaKeywords) {
        let text = '';
        row.metaKeywords.forEach(item => {
          text += item.text.trim();
        });
        row.metaKeywords = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.shippingWeight) {
        let text = '';
        row.shippingWeight.forEach(item => {
          text += item.text.trim();
        });
        row.shippingWeight = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text += item.text.trim();
        });
        row.ingredientsList = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.videoLength) {
        let text = '';
        row.videoLength.forEach(item => {
          text += `${item.text}|`;
        });
        row.videoLength = [
          {
            text: cleanUp(text.slice(0, -1)),
          },
        ];
      }
      if (row.featureBullets) {
        let text = '';
        row.featureBullets.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.featureBullets = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.legalDisclaimer) {
        let text = '';
        row.legalDisclaimer.forEach(item => {
          text += item.text.trim();
        });
        row.legalDisclaimer = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text += `${item.text.trim()}`;
        });
        row.directions = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.amazonChoiceCategory) {
        let text = '';
        row.amazonChoiceCategory.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}`;
        });
        row.amazonChoiceCategory = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = `${item.text.replace(',', '')}`;
        });
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
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += item.text.replace(/\n \n/g, ' ').replace('From the manufacturer', '').replace('Read more', '');
        });
        row.manufacturerDescription = [
          {
            text: cleanUp(text.replace(/<img.{1,300}">/g, '')),
          },
        ];
      }
      if (row.manufacturerImages) {
        const secondaryImages = [];
        row.manufacturerImages.forEach(alternateImage => {
          if (!alternateImage.text.includes('videoId')) {
            alternateImage.text = alternateImage.text.trim();
            !secondaryImages.find(({ text }) => text === alternateImage.text) && secondaryImages.push(alternateImage);
          }
        });
        row.manufacturerImages = secondaryImages;
      }
      if (row.videos) {
        for (const item of row.videos) {
          if (item.text.includes('.hls.m3u8')) {
            item.text = item.text.replace('.hls.m3u8', '.mp4.480.mp4');
          }
        }
      }
      if (row.packSize) {
        const item = row.packSize[0];
        row.packSize = [item];
      }
      if (row.largeImageCount) {
        for (const item of row.largeImageCount) {
          item.text = item.text.trim().match(/"hiRes":"https:/g) ? item.text.trim().match(/"hiRes":"https:/g).length : 0;
        }
      }
      if (row.promotion) {
        row.promotion.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
