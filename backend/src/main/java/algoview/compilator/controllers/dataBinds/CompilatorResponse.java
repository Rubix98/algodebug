package algoview.compilator.controllers.dataBinds;

import algoview.compilator.services.dataBinds.CompilatorServiceResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CompilatorResponse {
    private Boolean success;
    private List<CompilatorServiceResponse> details;
}
