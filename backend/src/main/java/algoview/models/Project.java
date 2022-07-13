package algoview.models;

import algoview.pojos.MarkPojo;
import algoview.pojos.TestCasePojo;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Vector;

@Getter
@Setter
@Document("projects")
public class Project {
    @Id
    private String id;
    private String title;
    private String language;
    private String code;
    private Vector<Integer> breakpoints;
    private Vector<MarkPojo> variables;
    private Vector<TestCasePojo> testCases;
}
