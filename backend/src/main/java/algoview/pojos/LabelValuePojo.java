package algoview.pojos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LabelValuePojo {
    private String label;
    private Object value;
    private String fieldType;

    public LabelValuePojo(String label, Object value) {
        this(label, value, null);
    }
}
