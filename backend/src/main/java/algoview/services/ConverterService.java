package algoview.services;

import algoview.models.Converter;
import algoview.repositories.ConverterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConverterService {

    @Autowired
    ConverterRepository converterRepository;

    public Converter save(Converter constructor) {
        return converterRepository.save(constructor);
    }

    public Converter findById(String id) {
        Optional<Converter> converter = converterRepository.findById(id);
        return converter.isPresent() ? converter.get() : null;
    }

    public List<Converter> findAll() {
        return converterRepository.findAll();
    }

}
