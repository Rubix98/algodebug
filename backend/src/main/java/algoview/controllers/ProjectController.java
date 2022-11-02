package algoview.controllers;

import algoview.models.Project;
import algoview.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("project")
public class ProjectController {

    @Autowired
    ProjectService projectService;

    @PostMapping("save")
    public Project save(@RequestBody Project project) {
        System.out.println("save/" + project.getId());
        return projectService.save(project);
    }

    @GetMapping("find/{id}")
    public Project findById(@PathVariable String id) {
        System.out.println("find/" + id);
        return projectService.findById(id);
    }

    @GetMapping("findAll")
    public List<Project> findAll() {
        System.out.println("findAll");
        return projectService.findAll();
    }

}
