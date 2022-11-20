package algodebug.logic.project;

import algodebug.logic.project.pojos.TestCasePojo;
import algodebug.logic.project.pojos.BreakpointPojo;
import algodebug.logic.project.pojos.SceneObject;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.Vector;

@Getter
@Setter
@Document("projects")
public class Project {
    @Id
    private String id;
    private String title;
    private String description;

    private String code;
    private String language;
    private Vector<BreakpointPojo> breakpoints;
    private Vector<TestCasePojo> testCases;
    private Vector<SceneObject> sceneObjects;

    private String author = "AlgoDebug"; // TODO: system logowania użytkowników
    private Date creationDate;
    private Date modificationDate;
}
