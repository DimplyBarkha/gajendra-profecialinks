
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
  console.log('extracted data', data);
  for (const { group } of data) {
    for (const row of group) {
      if (!row.nameExtended) {
        if (row.videos1) {
          delete row.videos1;
        }
        if (row.descriptionBullets) {
          delete row.descriptionBullets;
        }
        if (row.variantCount) {
          delete row.variantCount;
        }
        if (row.secondaryImageTotal) {
          delete row.secondaryImageTotal;
        }
        if (row.availabilityText) {
          delete row.availabilityText;
        }
        if (row.technicalInformationPdfPresent) {
          delete row.technicalInformationPdfPresent;
        }
        if (row.termsAndConditions) {
          delete row.termsAndConditions;
        }
        if (row.privacyPolicy) {
          delete row.privacyPolicy;
        }
        if (row.customerServiceAvailability) {
          delete row.customerServiceAvailability;
        }
        if (row.Image360Present) {
          delete row.Image360Present;
        }
        if (row.imageZoomFeaturePresent) {
          delete row.imageZoomFeaturePresent;
        }
        if (row.videos) {
          delete row.videos;
        }
      }
      if (row.price) {
        row.price.forEach(price => {
          price.text = `${price.text} $`;
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(price => {
          price.text = `${price.text} $`;
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(nameExtended => {
          if (row.brandText && row.color) {
            nameExtended.text = row.brandText[0].text + ' - ' + nameExtended.text + ' - ' + row.color[0].text.replace('Couleur:', '').trim();
          } else {
            if (row.brandText) {
              nameExtended.text = row.brandText[0].text + ' - ' + nameExtended.text;
            }
          }
        });
      }
      if (row.videos && row.videos1) {
        row.videos = [...row.videos, ...row.videos1];
      } else {
        if (!row.videos && row.videos1) {
          row.videos = row.videos1;
        }
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = item.text.replace(/\n \n/, '').trim();
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.shift();
      }
      if (row.category) {
        if (row.category[0].text.includes('Accueil')) {
          row.category.shift();
        }
      }
      if (row.quantity) {
        row.quantity.forEach(quantity => {
          quantity.text = quantity.text.replace('Product dimensions:', '').trim();
        });
      }
      if (row.color) {
        row.color.forEach(color => {
          color.text = color.text.replace('Couleur:', '').trim();
        });
      }
      if (row.variantInformation) {
        row.variantInformation.forEach(color => {
          color.text = color.text.replace('Couleur:', '').trim();
        });
      }
      if (row.specifications) {
        row.specifications.forEach(specifications => {
          specifications.text = specifications.text.replace(/\n/g, '||').trim();
        });
      }
      if (row.variantCount) {
        row.variantCount.forEach(variantCount => {
          if (variantCount.text === '1') {
            variantCount.text = '0';
            if (variantCount.value) {
              variantCount.value = 0;
            }
            if (variantCount.raw) {
              variantCount.raw = '0';
            }
          }
        });
      }
      if (row.variantAsins) {
        if (row.variantAsins.length === 1) {
          row.variantAsins.shift();
        } else {
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
      }
      if (row.variants) {
        if (row.variants.length === 1) {
          row.variants.shift();
        } else {
          let text = '';
          row.variants.forEach(item => {
            text += `${item.text} | `;
          });
          row.variants = [
            {
              text: text.slice(0, -3),
            },
          ];
        }
      }
      if (row.promotion) {
        let text = '';
        row.promotion.forEach(item => {
          text += `${item.text}`;
        });
        row.promotion = [
          {
            text: text,
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text}`;
        });
        row.additionalDescBulletInfo = [
          {
            text: text,
          },
        ];
      }
      if (row.weightNet) {
        row.weightNet.forEach(weight => {
          weight.text = weight.text.replace(/(.*) ([0-9]+[.]?[0-9]*) (.*)/, '$2');
        });
      }
      if (row.videoLength) {
        row.videoLength.forEach(video => {
          if (video.text.match(/(.*) \/ (.*)/)) {
            video.text = video.text.replace(/(.*) \/ (.*)/, '$2');
          }
        });
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
