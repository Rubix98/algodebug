package algodebug.logic.compilator.services.dto;

import algodebug.logic.compilator.models.OutputPojo;
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
