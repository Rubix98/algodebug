package algodebug.logic.project.pojos;

import algodebug.logic.converter.Converter;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VariablePojo {
    private Integer start;
    private Integer end;
    private String name;
    private String type;
    private Converter constructor;
}
