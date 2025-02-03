package com.example.demo.service;



import com.example.demo.converter.StudentConverter;
import com.example.demo.dao.Student;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dto.StudentDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public StudentDTO getStudentById(long id) {
        Student student= studentRepository.findById(id).orElseThrow(RuntimeException::new);
        return StudentConverter.convertStudent(student);
    }

    @Override
    public Long addNewStudent(StudentDTO studentDTO) {
        List<Student> studentList = studentRepository.findByEmail(studentDTO.getEmail());
        if(!CollectionUtils.isEmpty(studentList))
        {
            throw new IllegalArgumentException("Email"+studentDTO.getEmail()+"has already been taken");
        }
        Student student = studentRepository.save(StudentConverter.convertStudent(studentDTO));
        return student.getId();
    }
    @Override
    public void deleteStudentById(long id) {
        studentRepository.findById(id).orElseThrow(()->new IllegalArgumentException("id"+id+"not exists"));
        studentRepository.deleteById(id);
    }

    @Override
    @Transactional
    public StudentDTO updateStudentById(long id, String name, String email) {
        // 1. 確保 ID 存在，否則回傳 404
        Student studentInDB = studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student ID " + id + " not found"));

        // 2. 只有當值與原值不同時才更新
        boolean updated = false;

        if (StringUtils.hasText(name) && !name.equals(studentInDB.getName())) {
            studentInDB.setName(name);
            updated = true;
        }
        if (StringUtils.hasText(email) && !email.equals(studentInDB.getEmail())) {
            studentInDB.setEmail(email);
            updated = true;
        }

        // 3. 只有當有更新時才儲存
        if (updated) {
            studentRepository.save(studentInDB);
            studentRepository.flush(); // 確保馬上更新到 DB
        }

        // 4. 回傳更新後的物件
        return StudentConverter.convertStudent(studentInDB);
    }
}
