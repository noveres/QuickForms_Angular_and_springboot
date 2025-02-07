package com.example.quiz12.dao;

import com.example.quiz12.entity.Feedback;
import com.example.quiz12.entity.FeedbackId;
import com.example.quiz12.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackDao extends JpaRepository<Feedback, FeedbackId> {
    @Query(value = "select count(quiz_Id) from feedback where quiz_Id=?1 and email =?2", nativeQuery = true)
    public int selectCount(int quizId, String email);



}
