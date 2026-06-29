package com.jbncakes.repository;

import com.jbncakes.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM OrderItem oi WHERE oi.cake.id = :cakeId")
    void deleteByCakeId(Long cakeId);
}
