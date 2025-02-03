package com.example.demo.controller;

import com.example.demo.Response;
import com.example.demo.dao.Student;
import com.example.demo.dto.StudentDTO;
import com.example.demo.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
//@RequestMapping("/students")
//@CrossOrigin(origins = "http://localhost:8080")  // 允許前端存取
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/students/{id}")
    public Response<StudentDTO> getStudent(@PathVariable long id) {
        return Response.newSuccess(studentService.getStudentById(id));
    }

    @PostMapping("/students")
    public Response<Long> addNewStudent (@RequestBody StudentDTO studentDTO) {
        return Response.newSuccess(studentService.addNewStudent(studentDTO));
    }

    @DeleteMapping("/students/{id}")
    public void deleteStudentById(@PathVariable long id) {
        studentService.deleteStudentById(id);
    }

    @PutMapping("/students/{id}")
    public Response<StudentDTO> updateStudentById(@PathVariable long id, @RequestParam (required = false)String name
                                                 ,@RequestParam (required = false) String email) {
        return Response.newSuccess(studentService.updateStudentById(id, name, email));
    }

}
