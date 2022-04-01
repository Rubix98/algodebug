package algoview.models;

import algoview.pojos.MarkPojo;
import algoview.pojos.TestCasePojo;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Vector;

@Document("projects")
public class Project {
    @Id
    String id;
    String title;
    String language;
    String code;
    Vector<Integer> breakpoints;
    Vector<MarkPojo> marks;
    Vector<TestCasePojo> testCases;
}
