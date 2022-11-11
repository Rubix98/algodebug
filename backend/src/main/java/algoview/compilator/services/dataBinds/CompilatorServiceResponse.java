package algoview.compilator.services.dataBinds;

import algoview.compilator.models.OutputPojo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CompilatorServiceResponse {
    private Boolean success;
    private OutputPojo output;
    private String errorMessage;
}
