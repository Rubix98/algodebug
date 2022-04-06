package algoview.services;

import algoview.models.Project;
import algoview.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    ProjectRepository projectRepository;

    public Project save(Project project) {
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
