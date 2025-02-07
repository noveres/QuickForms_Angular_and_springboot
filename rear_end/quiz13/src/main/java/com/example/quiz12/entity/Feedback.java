package com.example.quiz12.entity;


import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "feedback")
@IdClass(value = FeedbackId.class)
public class Feedback {
    @Id
    @Column(name = "quiz_id")
    private int quizId;

    @Column(name = "user_name")
    private String userName;
    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "age")
    private int age;

    @Id
    @Column(name = "ques_id")
    private int quesId;

    @Column(name = "answer")
    private String answer;

    @Column(name = "fillin_date")
    private LocalDate fillinDate;





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
