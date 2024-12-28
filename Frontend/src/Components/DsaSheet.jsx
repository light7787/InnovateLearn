import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import {jwtDecode} from 'jwt-decode';

const DsaSheet = () => {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState('');
  const [userCompletedQuestions, setUserCompletedQuestions] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const token = parsedUser.token;
        if (token) {
          const decoded = jwtDecode(token);
          setUser(decoded._id);
        } else {
          console.warn('Token is missing in user data.');
        }
      } catch (error) {
        console.error('Error parsing or decoding token:', error.message);
      }
    } else {
      console.warn('No user data found in localStorage.');
    }
  }, []);

  useEffect(() => {
    const fetchQuestionsAndUser = async () => {
      try {
        const questionsResponse = await fetch('https://innovate-learn-v1ki.vercel.app/api/ques/questions');
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData.questions || []);

        if (user) {
          const userResponse = await fetch(`https://innovate-learn-v1ki.vercel.app/api/${user}`);
          const userData = await userResponse.json();
          setUserCompletedQuestions(userData.questions || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (user) {
      fetchQuestionsAndUser();
    }
  }, [user]);

  const handleQuestionStatus = async (questionId, isCompleted) => {
    const url = isCompleted
      ? 'https://innovate-learn-v1ki.vercel.app/api/removequestion'
      : 'https://innovate-learn-v1ki.vercel.app/api/addquestion';

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user,
          questionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserCompletedQuestions((prev) =>
          isCompleted
            ? prev.filter((q) => q.questionId !== questionId)
            : [...prev, { questionId, status: 'right' }]
        );

        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question._id === questionId
              ? { ...question, status: isCompleted ? 'not-done' : 'right' }
              : question
          )
        );

        console.log(data.message);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(`Error ${isCompleted ? 'removing' : 'adding'} question:`, error);
    }
  };

  const groupedQuestions = questions.reduce((acc, question) => {
    const { category } = question;
    acc[category] = acc[category] || [];
    acc[category].push({
      ...question,
      status: userCompletedQuestions.some(
        (completedQuestion) => completedQuestion.questionId === question._id && completedQuestion.status === 'right'
      )
        ? 'right'
        : 'not-done',
    });
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">DSA Questions</h1>

      <Accordion>
        {Object.entries(groupedQuestions).map(([category, questions], categoryIndex) => {
          const totalQuestions = questions.length;
          const attemptedQuestions = questions.filter((q) => q.status === 'right').length;
          const progressPercentage = Math.round((attemptedQuestions / totalQuestions) * 100);

          return (
            <Accordion.Item eventKey={categoryIndex.toString()} key={categoryIndex}>
              <Accordion.Header>
                {category} Questions ({attemptedQuestions}/{totalQuestions})
              </Accordion.Header>
              <Accordion.Body>
                <div className="mb-4">
                  <ProgressBar now={progressPercentage} label={`${progressPercentage}%`} />
                </div>

                {questions.length > 0 ? (
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="py-2 px-4 text-left">Select</th>
                        <th className="py-2 px-4 text-left">Title</th>
                        <th className="py-2 px-4 text-left">Link</th>
                        <th className="py-2 px-4 text-left">Difficulty</th>
                        <th className="py-2 px-4 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((question) => (
                        <tr key={question._id} className="border-b hover:bg-gray-100">
                          <td className="py-2 px-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={question.status === 'right'}
                              onChange={() =>
                                handleQuestionStatus(question._id, question.status === 'right')
                              }
                            />
                          </td>
                          <td className="py-2 px-4">{question.title}</td>
                          <td className="py-2 px-4">
                            <a
                              href={question.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500"
                            >
                              <img src="/leetcode-svgrepo-com.svg" alt="" className="w-5 h-5" />
                            </a>
                          </td>
                          <td className="py-2 px-4">{question.difficulty}</td>
                          <td className="py-2 px-4">
                            <button
                              className={`px-4 py-2 rounded ${
                                question.status === 'right' ? 'bg-red-500' : 'bg-green-500'
                              } text-white`}
                              onClick={() =>
                                handleQuestionStatus(question._id, question.status === 'right')
                              }
                            >
                              {question.status === 'right' ? 'Remove' : 'Mark as Done'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No questions available for this category.</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
};

export default DsaSheet;
