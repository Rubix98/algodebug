package algoview.controllers;

import algoview.models.Constructor;
import algoview.models.Project;
import algoview.services.ConstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("constructor")
public class ConstructorController {

    @Autowired
    ConstructorService constructorService;

    @PostMapping("save")
    public Constructor save(@RequestBody Constructor constructor) {
        System.out.println("save");
        return constructorService.save(constructor);
    }

    @PostMapping("find/{id}")
    public Constructor findById(@PathVariable String id) {
        System.out.println("find/" + id);
        return constructorService.findById(id);
    }

    @PostMapping("findAll")
    public List<Constructor> findAll() {
        System.out.println("findAll");
        return constructorService.findAll();
    }

}
