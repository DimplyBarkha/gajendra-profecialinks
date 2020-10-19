
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			if (row.availabilityText) {
				let newText = 'Out Of Stock';
				row.availabilityText.forEach(item => {
					if (item.text) {
						newText = 'In Stock';
					}
				});
				row.availabilityText = [{ text: newText }];
			}
			if (row.sku) {
				let newText = "";
				row.sku.forEach(item => {
					newText = item.text.replace("Art.nr: ", "")
				});
				row.sku = [{ text: newText }];
			}
			if (row.variantId) {
				let newText = "";
				row.variantId.forEach(item => {
					newText = item.text.replace("Art.nr: ", "")
				});
				row.variantId = [{ text: newText }];
			}

			if (row.price) {
				/* 
				let newText = "";
				row.price.forEach(item => {
					newText = item.text.trim().replace(":-", "");
				}); */
				row.price = [{ text: row.price[1].text.trim().replace(":-", "") }, { text: row.price[0].text }];
			}

			if (row.listPrice) {
				let newText = "";
				row.listPrice.forEach(item => {
					newText = item.text.trim().replace(":-", "");
				});
				row.listPrice = [{ text: newText }];
			}

			/* if (row.firstVariant) {
				let newText = "";
				row.firstVariant.forEach(item => {
					var res = item.text.trim().split("/");
					var res = res[res.length-2].split(".")[1];
					newText = res;
				});
				row.firstVariant = [{ text: newText }];
			} */
			if (row.aggregateRating) {
				let newText = '0';
				var received_per = row.aggregateRating[0].text.replace("width: ", "")
				var received_per = received_per.replace("%", "");

				if (received_per >= 1) {
					var aggregate_rating = (received_per * 5) / 100;
					var newaggregate_rating = aggregate_rating.toString().replace(",", ".");
					newText = newaggregate_rating;
				}

				/* row.aggregateRating.forEach(item => {
					
					var received_per = item.value*100;
					if(received_per >= 1){
						// var aggregate_rating = ( received_per * 5 )/100;
						//newText = aggregate_rating; 
						var aggregate_rating = ( received_per * 5 )/100;    
						var newaggregate_rating = aggregate_rating.toString().replace(".", ",");
						newText = newaggregate_rating;
					}
				}); */
				row.aggregateRating = [{ text: newText }];
			}
			if (row.additionalDescBulletInfo) {
				let text = '';
				row.additionalDescBulletInfo.forEach(item => {
					text += `${item.text.replace(/\n \n/g, ':')} || `;
				});
				row.additionalDescBulletInfo = [{ text: text.slice(0, -4) }];
			}
			if (row.manufacturerDescription) {
				let text = '';
				row.manufacturerDescription.forEach(item => {
					text += `${item.text.replace(/\n \n/g, ':')} | `;
				});
				row.manufacturerDescription = [{ text: text.slice(0, -4) }];
			}
			if (row.videos) {
				let newText = "";
				let finalText = "";
				let extraChar = "";
				row.videos.forEach(item => {
					finalText = newText = item.text.trim();
					extraChar = newText.substring(0, 2);
					if (extraChar == '//') {
						finalText = newText.replace("//", "");
					}
				});
				row.videos = [{ text: finalText }];
			}

			if (row.energyEfficiency) {
				let newText = "";
				row.energyEfficiency.forEach(item => {
					newText = item.text.trim().replace("Klass", "");
				});
				row.energyEfficiency = [{ text: newText }];
			}

			if (row.technicalInformationPdfPresent) {
				let newText = "NO";
				row.technicalInformationPdfPresent.forEach(item => {
					if (item.text == 'YES') {
						newText = 'YES';
					}
				});
				row.technicalInformationPdfPresent = [{ text: newText }];
			}
			if (row.shippingDimensions) {
				let newText = '';
				row.shippingDimensions.forEach(item => {
					var shippingDimensions = item.text;
					if (shippingDimensions.length > 0) {
						newText += shippingDimensions.toString() + " X ";
					}
				});
				newText = newText.substring(0, newText.length - 2).trim();
				row.shippingDimensions = [{ text: newText }];
			}
			if (row.description) {
				let newText = '';
				row.description.forEach(item => {
					var description = item.text;
					if (description.length > 0) {
						newText += description.toString() + "||";
					}

				});
				newText = newText.substring(0, newText.length - 2);
				row.description = [{ text: newText }];
			}
			if (row.specifications) {
				let newText = '';
				var index = 1;
				row.specifications.forEach(item => {
					var specifications = item.text;
					if (specifications.length > 0) {
						if (index % 2 != 0) {
							newText += specifications + ":";
						}
						else {
							newText += specifications + " || ";
						}
					}
					index++;
				});
				newText = newText.substring(0, newText.length - 1);
				row.specifications = [{ text: newText }];
			}

			if (row.alternateImages) {
				row.alternateImages.forEach(item => {
					item.text = item.text.replace('Large', 'Extra');
				});
			}

			if (row.nameExtended) {
				var nameExtended = row.nameExtended[0].text;
				if (row.brandText) {
					var brand = nameExtended.includes(row.brandText[0].text);
					if (!brand) {
						row.nameExtended[0].text = row.brandText[0].text + ' ' + nameExtended;
					}
				}
			}
		}
	}

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

module.exports = { transform };