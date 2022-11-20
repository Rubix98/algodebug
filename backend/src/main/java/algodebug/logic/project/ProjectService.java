package algodebug.logic.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    ProjectRepository projectRepository;

    public Project save(Project project) {
        if (project.getId() == null) {
            project.setCreationDate(new Date());
        }
        project.setModificationDate(new Date());
        return projectRepository.save(project);
    }

    public Project findById(String id) {
        Optional<Project> project = projectRepository.findById(id);
        return project.isPresent() ? project.get() : null;
    }

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

}
