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
@Document("converters")
public class Converter {
    @Id
    private String id;
    private String title;
    private String language;
    private String code;

    public DialogDataPojo getDialogData() {
        return new DialogDataPojo("", Arrays.asList(
                new LabelValuePojo("Nazwa", this.title),
                new LabelValuePojo("Kod", this.code, "textarea")
        ));
    }
}
