package com.example.quiz12.service.ifs;

import com.example.quiz12.vo.BasicRes;
import com.example.quiz12.vo.CreateReq;
import com.example.quiz12.vo.DeleteReq;
import com.example.quiz12.vo.GetQuesRes;
import com.example.quiz12.vo.QuizSearchRes;
import com.example.quiz12.vo.SearchReq;
import com.example.quiz12.vo.UpdateReq;

public interface QuizService {
	
	public BasicRes create(CreateReq req);
	
	public QuizSearchRes getAllQuiz();
	
	public QuizSearchRes getQuiz(SearchReq req);
	
	public GetQuesRes getQuesByQuizId(int quizId);
	
	public BasicRes delete(DeleteReq req);
	
	public BasicRes update(UpdateReq req);

}
