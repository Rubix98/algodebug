package algoview.compilator.controllers.dataBinds;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CompilatorRequest {
    private String code;
    private String language;
    private List<String> inputs;
}