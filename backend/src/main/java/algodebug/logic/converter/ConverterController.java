package algodebug.logic.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("converter")
public class ConverterController {

    @Autowired
    ConverterService converterService;

    @PutMapping("save")
    public Converter save(@RequestBody Converter converter) {
        System.out.println("converter/save/" + converter.getId());
        return converterService.save(converter);
    }

    @GetMapping("find/{id}")
    public Converter findById(@PathVariable String id) {
        System.out.println("converter/find/" + id);
        return converterService.findById(id);
    }

    @GetMapping("findAll")
    public List<Converter> findAll() {
        System.out.println("converter/findAll");
        return converterService.findAll();
    }

}