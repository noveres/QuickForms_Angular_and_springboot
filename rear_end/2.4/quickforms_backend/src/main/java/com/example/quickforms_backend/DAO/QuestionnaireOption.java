package com.example.quickforms_backend.DAO;
import java.util.List;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "questionnaire_options")
@Data
public class QuestionnaireOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "choice")
    private String choice;

    @Column(name = "max")
    private Integer max;  // 評分問題的最大值

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private QuestionnaireQuestion question;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChoice() {
        return choice;
    }

    public void setChoice(String choice) {
        this.choice = choice;
    }

    public Integer getMax() {
        return max;
    }

    public void setMax(Integer max) {
        this.max = max;
    }

    public QuestionnaireQuestion getQuestion() {
        return question;
    }

    public void setQuestion(QuestionnaireQuestion question) {
        this.question = question;
    }
}