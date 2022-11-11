package algoview.compilator.services.impl.codeX.dataBinds;

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
