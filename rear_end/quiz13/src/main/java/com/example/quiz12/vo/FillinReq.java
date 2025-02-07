package com.example.quiz12.vo;

import com.example.quiz12.entity.Feedback;
import jakarta.persistence.Column;
import jakarta.persistence.Id;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class FillinReq {


    private int quizId;
    private String userName;
    private String email;

    private int age;
    // 問題編號(quesId)和答案(answer)
    private Map<Integer, List<String>> quesIdAnswerMap;
    //給定預設值(當前日期)：前端送過來的req中，若此沒有值，便會直接覆蓋
    private LocalDate fillinDate = LocalDate.now();
    private int quesId;

    private String answer;



    public int getQuizId() {
        return quizId;
    }

    public void setQuizId(int quizId) {
        this.quizId = quizId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public Map<Integer, List<String>> getQuesIdAnswerMap() {
        return quesIdAnswerMap;
    }

    public void setQuesIdAnswerMap(Map<Integer, List<String>> quesIdAnswerMap) {
        this.quesIdAnswerMap = quesIdAnswerMap;
    }

    public int getQuesId() {
        return quesId;
    }

    public void setQuesId(int quesId) {
        this.quesId = quesId;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public LocalDate getFillinDate() {
        return fillinDate;
    }

    public void setFillinDate(LocalDate fillinDate) {
        this.fillinDate = fillinDate;
    }



}

