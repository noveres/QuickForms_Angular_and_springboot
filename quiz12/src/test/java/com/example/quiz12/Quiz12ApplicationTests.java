package com.example.quiz12;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.quiz12.dao.QuizDao;
import com.example.quiz12.service.ifs.QuizService;
import com.example.quiz12.vo.DeleteReq;

@SpringBootTest
class Quiz12ApplicationTests {

	@Autowired
	private QuizService quizService;
	
	@Autowired
	private QuizDao quizDao;

	@Test
	void contextLoads() {
		List<Integer> quizIdList = List.of(1);
		DeleteReq req = new DeleteReq();
		req.setQuizIdList(quizIdList);
		try {
			quizService.delete(req);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Test
	public void test() {
		System.out.println(quizDao.selectCount(1));
	}

}
