import React, { useEffect, useState } from "react";
import ModalForInfo from "./Modal";
import { useHistory } from "react-router-dom";
import Helper from "../../common/consts/Helper";
import { Switch } from "antd";
import AnswerModal from "./Modal/AnswerModal";

const QuestionsAnswers = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isAnswerVisible, setIsAnswerVisible] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [selectedQuestion, setSelectedQuestion] = useState("");
    const [selectedAnswers, setSelectedAnswers] = useState([]);
	const history = useHistory();
	useEffect(() => {
		getQuestions();
	}, []);
    useEffect(() => {
        if(selectedQuestion !== "")
        setIsAnswerVisible(true);
    }, [selectedAnswers, selectedQuestion])
	const getQuestions = async () => {
		let result = await Helper("get_questions", "POST", {});
		setQuestions(result.questions);
	};
	const handleChecked = async (questionId, active) => {
		await Helper(`question/${questionId}`, "PATCH", { isActive: active });
		getQuestions();
	};
    const handleDelete = async (questionId) => {
        await Helper(`question/${questionId}`, "DELETE", {})
        getQuestions();
    }
	return (
		<div className="content">
			<div className="card card-user">
				<div className="card-header d-flex align-items-center justify-content-between">
					<h5 className="card-title">Questions Answers List</h5>
					<button
						className="btn btn-primary"
						onClick={() => history.push("/add_qa")}>
						Add Question
					</button>
				</div>
				<div className="card-body">
					<table id="fresh-table" class="table">
						<thead>
							<th data-field="id">ID</th>
							<th data-field="name">Question</th>
							<th data-field="salary">Answers Count</th>
							<th data-field="country">View Answer</th>
							<th data-field="city">Edit</th>
							<th data-field="actions">Delete</th>
							<th data-field="actions">Approve</th>
						</thead>
						<tbody>
							{questions?.map((question, index) => (
								<tr>
									<td>{index + 1}</td>
									<td>{question.question}</td>
									<td>{question.answer.length}</td>
									<td>
										<button
											className="btn btn-primary"
											onClick={() => {
												setIsAnswerVisible(
													!isAnswerVisible
												);
												setSelectedQuestion(question);
                                                setSelectedAnswers(question.answer)
											}}>
											{question.answer.length
												? "Update Answers"
												: "Add Answer"}
										</button>
									</td>
									<td>
										<button
											className="btn btn-primary"
											onClick={() => history.push({pathname: "/add_qa", state: {question: question}})}>
											Edit
										</button>
									</td>
									<td>
										<button
											className="btn btn-primary"
											onClick={() => handleDelete(question._id)}>
											Delete
										</button>
									</td>
									<td>
										<Switch
											checked={question.isActive}
											onChange={(checked) =>
												handleChecked(
													question._id,
													checked
												)
											}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{
                        isAnswerVisible &&
						<AnswerModal
							visible={isAnswerVisible}
							setVisible={setIsAnswerVisible}
                            question={selectedQuestion}
                            getQuestions={getQuestions}
                            questionAnswers={selectedAnswers}
						/>
					}
					{isModalVisible && (
						<ModalForInfo
							visible={isModalVisible}
							setvisible={setIsModalVisible}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default QuestionsAnswers;
