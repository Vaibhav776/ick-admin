import { useEffect, useState, useRef } from 'react';
import { Checkbox } from "antd";
import _ from 'lodash'
const CheckboxGroup = Checkbox.Group;

export default function Modal({
	variantName,
	features,
	data,
	setData,
	selectedModalIndex,
}) {
	const [featureHeadings, setFeatureHeadings] = useState([]);
	const [selectedFeatures, setSelectedFeatures] = useState(
		data[selectedModalIndex]?.specificFeatures
	);
	const modal = useRef(null);

	useEffect(() => {
		setFeatureHeadings(Object.keys(features));
	}, [features]);

	const onChange = (heading, list) => {
		let newList = [];
		list.forEach((val) => {
			let found = features[heading].find((head) => head.Feature === val);
			newList.push(found);
		})
		let newSelectedFeatures = {
			...selectedFeatures,
			[heading]: [...newList],
		};
		console.log(newSelectedFeatures, "List");
		setSelectedFeatures(newSelectedFeatures);
		let newData = {
			variantId: data[0].variantId,
			standardFeatures: data[0].standardFeatures,
			specificFeatures: {
				...data[0].specificFeatures,
				...newSelectedFeatures
			},
		};
		setData([newData]);
	};

	useEffect(() => {
		if(selectedFeatures) {
			// let localData = data.slice();
			let foundVariant = data[selectedModalIndex];
			Object.keys(selectedFeatures)?.forEach((sel, index) => {
				if (foundVariant?.specificFeatures?.[sel]) {
					if (
						selectedFeatures?.[sel].find((feat) => !foundVariant?.specificFeatures?.[sel].includes(feat))
					)
						foundVariant.specificFeatures[sel] = _.uniq([
							// ...foundVariant?.specificFeatures[sel],
							...selectedFeatures?.[sel],
						]);
				} else {
					foundVariant = {
						...foundVariant,
						specificFeatures: {
							...foundVariant.specificFeatures,
							[sel]: selectedFeatures?.[sel],
						},
					};
				}
			});
			data[selectedModalIndex] = foundVariant;
			setData(_.uniq([...data]));
		}
	}, [selectedFeatures])

	const handleSpecificFeatures = () => {
		setData([...data])	
		modal.current.click();
	};

	return (
		<div
			className="modal fade"
			id="featureModal"
			tabindex="-1"
			role="dialog"
			aria-labelledby="exampleModalLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog modal-lg" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="exampleModalLabel">
							Add {variantName?.variant} Features
						</h5>
						<button
							type="button"
							className="close"
							data-dismiss="modal"
							aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">
						{featureHeadings?.map((heading, index) => {
							return (
								<div key={index} className="">
									<div>{heading}</div>
									<div className="col-12 my-2">
										<CheckboxGroup
											options={features?.[heading]?.map(
												(feature) => feature.Feature
											)}
											onChange={(list) =>
												onChange(heading, list)
											}
											value={
												data?.[
												selectedModalIndex
											]?.specificFeatures?.[heading] 
												? 
											data?.[
												selectedModalIndex
											]?.specificFeatures?.[heading]?.map(
												(head) => head.Feature
											) : 
											[]}
										/>
									</div>
								</div>
							);
						})}
					</div>
					<div className="modal-footer">
						<button
							ref={modal}
							type="button"
							className="btn btn-secondary"
							data-dismiss="modal"
							onClick={() => setSelectedFeatures({})}>
							Close
						</button>
						<button
							type="button"
							className="btn btn-primary"
							onClick={handleSpecificFeatures}>
							Save changes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
