package algoview.compilator.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class BreakpointPojo {
    private Integer line;
    private Map<String, String> variables;

    public BreakpointPojo() {
        this.variables = new HashMap<>();
    }
}
