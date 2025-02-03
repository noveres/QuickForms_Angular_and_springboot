package com.example.demo.dao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

//@Repository 是語意化的註解，用來表示類別是持久化層的組件。
// 透過這個註解，Spring 可以將該類別識別為持久化層，並將其實例化並註冊到 Spring 容器中進行管理。
//@Controller：标记控制层的组件，用于处理请求和返回视图。
//@Service：标记服务层的组件，表示业务逻辑层。
//@Component：通用的组件注解，标记为 Spring 容器管理的组件，@Repository 和 @Service 实际上是它的特化版本。

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

   List<Student> findByEmail(String email);
}
