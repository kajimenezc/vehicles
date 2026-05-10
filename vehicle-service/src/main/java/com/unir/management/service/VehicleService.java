package com.unir.management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.unir.management.persistence.model.Vehicle;
import com.unir.management.persistence.repository.VehicleRepository;
import com.unir.management.shared.exception.ResourceNotFoundException;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id " + id));
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        vehicle.setId(null);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setBrand(vehicleDetails.getBrand());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setState(vehicleDetails.getState());
        vehicle.setDateReturn(vehicleDetails.getDateReturn());
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> searchVehicles(String brand, String model) {
        String brandValue = brand == null ? "" : brand.trim();
        String modelValue = model == null ? "" : model.trim();

        if (brandValue.isEmpty() && modelValue.isEmpty()) {
            return getAllVehicles();
        }
        if (brandValue.isEmpty()) {
            return vehicleRepository.findByModelContainingIgnoreCase(modelValue);
        }
        if (modelValue.isEmpty()) {
            return vehicleRepository.findByBrandContainingIgnoreCase(brandValue);
        }
        return vehicleRepository.findByBrandContainingIgnoreCaseAndModelContainingIgnoreCase(brandValue, modelValue);
    }

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByState("disponible");
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }
}
