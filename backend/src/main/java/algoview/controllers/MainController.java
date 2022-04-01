package algoview.controllers;

import algoview.models.Project;
import algoview.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("project")
public class MainController {

    @Autowired
    ProjectService projectService;

    @PostMapping("save")
    public Boolean save(@RequestBody Project project) {
        System.out.println("save");
        return projectService.save(project);
    }

    @PostMapping("get/{id}")
    public Project getById(@PathVariable String id) {
        return projectService.findById(id);
    }

    @PostMapping("getAll")
    public List<Project> getAll(@PathVariable String id) {
        return projectService.findAll();
    }

}
