package com.example.quiz12.service.impl;

import com.example.quiz12.constants.QuesType;
import com.example.quiz12.constants.ResMessage;
import com.example.quiz12.dao.FeedbackDao;
import com.example.quiz12.dao.QuestionDao;
import com.example.quiz12.dao.QuizDao;
import com.example.quiz12.entity.Feedback;
import com.example.quiz12.entity.Question;
import com.example.quiz12.entity.Quiz;
import com.example.quiz12.service.ifs.FeebackService;

import com.example.quiz12.vo.BasicRes;
import com.example.quiz12.vo.FillinReq;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.*;

@Service
public class FeebackServiceImpl implements FeebackService {
    @Autowired
    private QuizDao quizDao;
    @Autowired
    private QuestionDao questionDao;
    @Autowired
    private FeedbackDao feedbackDao;

    @Override
    public BasicRes fillin(FillinReq req) {
        //1.參數檢查
        BasicRes checkRes = checkParam(req);
        if (checkRes != null) {
            return checkRes;
        }
        //2.檢查問卷是否存在and是否成功發布
        if (quizDao.selectCount(req.getQuizId()) != 1) {
            return new BasicRes(ResMessage.QUIZ_NOT_FOUND.getCode(),
                    ResMessage.QUIZ_NOT_FOUND.getMessage());
        }
        //3.檢查同一個Email是否已經填寫過
        if (feedbackDao.selectCount(req.getQuizId(), req.getEmail()) != 0) {
            return new BasicRes(ResMessage.EMAIL_DUPLICATED.getCode(),
                    ResMessage.EMAIL_DUPLICATED.getMessage());
        }
        //4.檢查問題
        //4.1 檢查填寫日期是否在問卷可填寫的範圍內
        //利用 quizId 找出問卷(使用JPA方法)：被Optionai 包起來主要用來提宿要判斷的內容物是否有值
        Optional<Quiz> op = quizDao.findById(req.getQuizId());
        //判斷被Optional 包起來的物件是否有數值
        if (op.isEmpty()) { //op.isEmpty() == true 時，表示從資料庫取回的 Quiz 物件是空的
            return new BasicRes(ResMessage.QUIZ_NOT_FOUND.getCode(),
                    ResMessage.QUIZ_NOT_FOUND.getMessage());
        }
        ;
        //將 Quiz 物件從Optional 取出
        Quiz quiz = op.get();
        //4.1 檢查填寫日期是否在問卷可填寫的範圍內
//        LocalDate startDate = quiz.getStartDate();
//        LocalDate endDate = quiz.getEndDate();
//        LocalDate fillinDate = req.getFillinDate();


        //================

        //   if (!(req.getFillinDate().isBefore(quiz.getStartDate()) && req.getFillinDate().isAfter(quiz.getEndDate()))) {
        //            return new BasicRes(ResMessage.QUIZ_NOT_FOUND.getCode(),
        //                    ResMessage.QUIZ_NOT_FOUND.getMessage());
        //        }

        //=======+++++
        //判斷填寫時間是否
        if (req.getFillinDate().isBefore(quiz.getStartDate()) || req.getFillinDate().isAfter(quiz.getEndDate())) {
            return new BasicRes(ResMessage.OUT_OF_DATA_RANGE.getCode(),
                    ResMessage.OUT_OF_DATA_RANGE.getMessage());
        }
        //4.2 比對相同的題號中填寫的答案(來自req)答案與選項(來自資料庫)是否相同(除了簡答)
        List<Question> quesList = questionDao.getByQuizId(req.getQuizId());
        Map<Integer, List<String>> quesIdAndAnswerMap = req.getQuesIdAnswerMap();
        for (Question item : quesList) {
            //比對題號
            int quesNumber = item.getQuesId();
            //若該題是必填，但沒有答案
            List<String> answerList = quesIdAndAnswerMap.get(item.getQuesId());
            if (item.isRequired() && CollectionUtils.isEmpty(answerList)) {
                return new BasicRes(ResMessage.AMSWER_IS_REQUIRED.getCode(),
                        ResMessage.AMSWER_IS_REQUIRED.getMessage());
            }
            //若題目是單選或簡答，答案不能有多個

            String questionType = item.getType();
            if (questionType.equalsIgnoreCase(QuesType.SINGLE.getType())
                    || questionType.equalsIgnoreCase(QuesType.TEXT.getType())) {
                if (answerList.size() > 1) {
                    return new BasicRes(ResMessage.ONE_OPTION_IS_ALLOWE.getCode(),
                            ResMessage.ONE_OPTION_IS_ALLOWE.getMessage());
                }
                // 排除題目類型為Text的題目
                if (questionType.equalsIgnoreCase(QuesType.TEXT.getType())) {
                    //跳過當次比對
                    continue;
                }
                // 比對相同題號中的選項跟答案
                // 將選項中的字串轉成:List<String>：要線確定當初創建問卷時前端的多個選項是陣列，且使用Stringify 轉成字符串型態
                ObjectMapper mapper = new ObjectMapper();
                try {
                  List<String> options = mapper.readValue(item.getOptions(), new TypeReference<>() {});
                 for (String answer : answerList) {
                     if (!options.contains(answer)) {
                         return new BasicRes(ResMessage.OPTION_ANSWER_MISMATCH.getCode(),
                                 ResMessage.OPTION_ANSWER_MISMATCH.getMessage());
                     }
                 }
                  for (String option : options) {
                      List<String> strList =List.of(option.split(","));
                      for (String answer : answerList) {

                      }
                  }
                } catch (JsonProcessingException e) {
                    return new BasicRes(ResMessage.OPTIONS_PATTERN_ERROR.getCode(),
                            ResMessage.OPTIONS_PATTERN_ERROR.getMessage());
                }
            }
        }
        List<Feedback>feedbackList = new ArrayList<>();
        //5.寫入資料庫
        ObjectMapper mapper = new ObjectMapper();
        for (Map.Entry<Integer, List<String>> map : req.getQuesIdAnswerMap().entrySet()) {
            Feedback feedback = new Feedback();
            feedback.setQuizId(req.getQuizId());
            feedback.setUserName(req.getUserName());
            feedback.setEmail(req.getEmail());
            feedback.setAge(req.getAge());
            feedback.setQuesId(map.getKey());
            //將List<String>> 轉成 String
            try {
                String answer =  mapper.writeValueAsString(map.getValue());
                feedback.setAnswer(answer);
            } catch (JsonProcessingException e) {
                return new BasicRes(ResMessage.OPTIONS_PATTERN_ERROR.getCode(),
                        ResMessage.OPTIONS_PATTERN_ERROR.getMessage());
            }
//            String answer =  mapper.writeValueAsString(map.getValue());
//            feedback.setAnswer(map.getValue());

            feedback.setFillinDate(req.getFillinDate());
            feedbackList.add(feedback);
        }
        feedbackDao.saveAll(feedbackList);
        return new BasicRes(ResMessage.SUCCESS.getCode(),
                ResMessage.SUCCESS.getMessage());
    }



    private BasicRes checkParam(FillinReq req){
        if (req.getQuizId() <= 0) {
            return new BasicRes(ResMessage.PARAM_QUES_ID_ERROR.getCode()
                    , ResMessage.PARAM_QUES_ID_ERROR.getMessage());
        }
        if (!StringUtils.hasText(req.getUserName())) {
            return new BasicRes(ResMessage.PARAM_USERNAM_ERROR.getCode()
                    , ResMessage.PARAM_USERNAM_ERROR.getMessage());
        }
        if (!StringUtils.hasText(req.getUserName())) {
            return new BasicRes(ResMessage.PARAM_USERNAM_ERROR.getCode()
                    , ResMessage.PARAM_USERNAM_ERROR.getMessage());
        }
        if (req.getAge() <= 0) {
            return new BasicRes(ResMessage.PARAM_AGE_ERROR.getCode()
                    , ResMessage.PARAM_AGE_ERROR.getMessage());
        }
        return null;
    }

}
