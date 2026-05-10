package com.unir.management.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.unir.management.persistence.model.Vehicle;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByBrandContainingIgnoreCase(String brand);

    List<Vehicle> findByModelContainingIgnoreCase(String model);

    List<Vehicle> findByBrandContainingIgnoreCaseAndModelContainingIgnoreCase(String brand, String model);

    List<Vehicle> findByState(String state);
}
