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
@Document("constructors")
public class Constructor {
    @Id
    private String id;
    private String title;
    private String language;
    private String type;
    private String code;
}
