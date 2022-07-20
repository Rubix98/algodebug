package algoview.models;

import algoview.pojos.DialogDataPojo;
import algoview.pojos.LabelValuePojo;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;

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

    public DialogDataPojo getDialogData() {
        return new DialogDataPojo(this.title);
    }
}
