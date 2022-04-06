package algoview.services;

import algoview.models.Constructor;
import algoview.repositories.ConstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConstructorService {

    @Autowired
    ConstructorRepository constructorRepository;

    public Constructor save(Constructor constructor) {
        return constructorRepository.save(constructor);
    }

    public Constructor findById(String id) {
        Optional<Constructor> constructor = constructorRepository.findById(id);
        return constructor.isPresent() ? constructor.get() : null;
    }

    public List<Constructor> findAll() {
        return constructorRepository.findAll();
    }

}
