package algoview.pojos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Arrays;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DialogDataPojo {
    private String label;
    private List<LabelValuePojo> properties;

    public DialogDataPojo(String label) {
        this(label, Arrays.asList());
    }
}
