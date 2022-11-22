package algodebug.logic.compilator.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class FramePojo {
    private Integer id;
    private Integer line;
    private Map<String, String> variables;

    public FramePojo() {
        this.variables = new HashMap<>();
    }

    public FramePojo(Integer line, Map<String, String> variables) {
        this.line = line;
        this.variables = variables;
    }
}
