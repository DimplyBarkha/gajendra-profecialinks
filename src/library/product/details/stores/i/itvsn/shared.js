
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			/* if (row.availabilityText) {
				let newText = 'Out Of Stock';
				row.availabilityText.forEach(item => {
					console.log(item);
					if (item.text.trim() === 'true') {
						newText = 'In Stock';
					}
				});
				row.availabilityText = [{ text: newText }];
			} */
			if (row.warranty) {
				let newText = '';
				row.warranty.forEach(item => {
					newText = `${item.text.replace(/&nbsp;|\*/g, '')}`
				});
				row.warranty = [{ text: newText }];
			}

			if (row.price) {
				let newTextStr = "";
				if (row.price[0].text.trim() != '') {
					newTextStr = row.price[0].text.trim()
					row.price = [{ text: newTextStr.substring(1) }, { text: newTextStr.charAt(0) }];
				}
			}

			if (row.listPrice) {
				let newTextStr = "";
				if (row.listPrice[0].text.trim() != '') {
					newTextStr = row.listPrice[0].text.trim()
					row.listPrice = [{ text: newTextStr.substring(1) }, { text: newTextStr.charAt(0) }];
				}
			}

			/* if (row.sku) {
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
			
			if (row.firstVariant) {
				let newText = "";
				row.firstVariant.forEach(item => {
					var res = item.text.trim().split("/");
					var res = res[res.length-2].split(".")[1];
					newText = res;
				});
				row.firstVariant = [{ text: newText }];
			}
			if (row.aggregateRating) {
				let newText = 0;
				row.aggregateRating.forEach(item => {
					var received_per = item.raw.replace("width: ", "")
					var received_per = received_per.replace("%", "");
					if(received_per >= 1){
						var aggregate_rating = ( received_per * 5 )/100;
						newText = aggregate_rating;
					}
				});
				row.aggregateRating = [{ text: newText }];
			}
			if (row.additionalDescBulletInfo) {  
				let newText = '';
				row.additionalDescBulletInfo.forEach(item => {
					newText +=  `${item.text.replace(/ \n|&dash;|\r/g, ' || ')}`;
				});
				row.additionalDescBulletInfo = [{ text: newText.slice(0, -4) }];
			} */
			if (row.image) {
				let text = '';
				row.image.forEach(item => {
					if(item.text.match('https:')){
						text = item.text;
					}
					else{
						text = 'https://www.itvsn.com.au' + item.text;
					}
					item.text = text;
				})
			}
			if (row.alternateImages) {
				let text = '';
				row.alternateImages.forEach(item => {
					if(item.text.match('https:')){
						text = item.text;
					}
					else{
						text = 'https://www.itvsn.com.au' + item.text;
					}
					item.text = text;
				})
			}
			if (row.aggregateRating2) {
				let newText = "";
				row.aggregateRating2.forEach(item => {
					newText = item.text.replace(".", ",");
				});
				row.aggregateRating2 = [{ text: newText }];
			}
			if (row.specifications) {
				let newText = '';
				row.specifications.forEach(item => {
					newText += `${item.text.replace(/ \n|&dash;|\r/g, ' || ')}`;
				});
				row.specifications = [{ text: newText }];
			}
			if (row.description) {
				let newText = '';
				row.description.forEach(item => {
					newText += `${item.text.replace(/ \n|&dash;|\r/g, ' || ')}`;
				});
				row.description = [{ text: newText }];
			}
			if (row.additionalDescBulletInfo) {
				let newText = '';
				row.additionalDescBulletInfo.forEach(item => {
					newText += `${item.text.replace(/ \n|&dash;|\r/g, ' || ')}`;
				});
				row.additionalDescBulletInfo = [{ text: newText }];
			}
			if (row.variants) {
				let newText = '';
				row.variants.forEach((item, index) => {
					newText += `${item.text + ' | '}`;
				});
				row.variants = [{ text: newText.slice(0, -3) }];
			}
			if (row.weightNet) {
				let newText = '';
				row.weightNet.forEach(item => {
					newText += `${item.text.replace("Product weight - ", "")}`;
				});
				row.weightNet = [{ text: newText.trim() }];
			}
			if (row.color) {
				let newText = '';
				row.color.forEach(item => {
					newText += `${item.text.replace("Wand Colour -", "")}`;
				});
				row.color = [{ text: newText.trim() }];
			}
			if (row.packSize) {
				let newText = '';
				row.packSize.forEach(item => {
					let stringArr = item.text.split("-");
					console.log(stringArr);
					if (stringArr.length > 2) {
						newText += `${stringArr[stringArr.length - 1]}`;
					}
				});
				row.packSize = [{ text: newText.trim() }];
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
