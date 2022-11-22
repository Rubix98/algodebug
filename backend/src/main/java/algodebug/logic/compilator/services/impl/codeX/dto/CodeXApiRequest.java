package algodebug.logic.compilator.services.impl.codeX.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CodeXApiRequest {
    private String code;
    private String language;
    private String input;
}
