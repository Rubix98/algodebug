package algoview.controllers;

import algoview.models.Converter;
import algoview.services.ConverterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("converter")
public class ConverterController {

    @Autowired
    ConverterService converterService;

    @PostMapping("save")
    public Converter save(@RequestBody Converter converter) {
        System.out.println("save");
        return converterService.save(converter);
    }

    @GetMapping("find/{id}")
    public Converter findById(@PathVariable String id) {
        System.out.println("find/" + id);
        return converterService.findById(id);
    }

    @GetMapping("findAll")
    public List<Converter> findAll() {
        System.out.println("findAll");
        return converterService.findAll();
    }

}
