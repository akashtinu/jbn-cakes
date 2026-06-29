package com.jbncakes.repository;

import com.jbncakes.model.Cake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CakeRepository extends JpaRepository<Cake, Long> {
    List<Cake> findByCategory(String category);
    List<Cake> findByAvailableTrue();
}
