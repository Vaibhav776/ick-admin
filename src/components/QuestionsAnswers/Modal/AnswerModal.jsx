import { Modal } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Helper from "../../../common/consts/Helper";

export default function AnswerModal({ visible, setVisible, question, getQuestions, questionAnswers}) {
	const [answers, setAnswers] = useState([]);
    useEffect(() => {
        setAnswers(questionAnswers)
    }, questionAnswers);
	const handleModal = () => {
		setVisible(!visible);
	};
	const handleAddAnswers = (status, index) => {
        const allAnswers = answers.slice();
        if(status) {
            allAnswers.push("");
        } else {
            allAnswers.splice(index, 1)
        }
        setAnswers(allAnswers);
	};
	const handleChange = (value, index) => {
		const allAnswers = answers.slice();
		allAnswers[index] = value;
		setAnswers(allAnswers);
	};
    const addAnswer = async () => {
        await Helper(`question/${question._id}`, "PUT", {question: question.question, answer: answers})
        toast.success("Answers added successfully");
        setAnswers([]);
        setVisible(false);
        getQuestions();
    }
	console.log(answers);
	return (
		<Modal
			width={1000}
			title={"Add Answers"}
			visible={visible}
			onOk={handleModal}
			onCancel={handleModal}
            footer={false}
        >
			<div className="content">
				<div className="row">
					<div className="col-md-12">
						<label>Answers</label>
						{answers.map((answer, index) => (
							<div className="d-flex mb-3">
								<textarea
									className="form-control mr-4 px-2"
									key={index}
									value={answer}
									onChange={(e) =>
										handleChange(e.target.value, index)
									}
								/>
								<div>
									<button
										className="btn btn-warning"
										onClick={() =>
											handleAddAnswers(0, index)
										}>
										-
									</button>
								</div>
							</div>
						))}
					</div>
					<div className="col-md-12 d-flex justify-content-center">
						<button
							className="btn btn-primary"
							onClick={() => handleAddAnswers(1, -1)}>
							+
						</button>
					</div>
					<div className="col-md-12 d-flex justify-content-center">
						<button
							className="btn btn-primary"
							onClick={addAnswer}>
							Add Answers
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
