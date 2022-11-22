package algodebug.logic.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("project")
public class ProjectController {

    @Autowired
    ProjectService projectService;

    @PutMapping("save")
    public Project save(@RequestBody Project project) {
        System.out.println("project/save/" + project.getId());
        return projectService.save(project);
    }

    @GetMapping("find/{id}")
    public Project findById(@PathVariable String id) {
        System.out.println("project/find/" + id);
        return projectService.findById(id);
    }

    @GetMapping("findAll")
    public List<Project> findAll() {
        System.out.println("project/findAll");
        return projectService.findAll();
    }

}
