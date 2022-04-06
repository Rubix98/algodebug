package algoview.pojos;

import algoview.models.Constructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarkPojo {
    private Integer start;
    private Integer end;
    private String name;
    private String type;
    private Constructor constructor;
}
