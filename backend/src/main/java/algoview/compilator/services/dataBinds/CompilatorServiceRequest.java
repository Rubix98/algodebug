package algoview.compilator.services.dataBinds;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CompilatorServiceRequest {
    private String code;
    private String language;
    private String input;
}
