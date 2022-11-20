package algodebug.logic.converter;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document("converters")
public class Converter {
    @Id
    private String id;
    private String title;
    private String language;
    private String code;
}
