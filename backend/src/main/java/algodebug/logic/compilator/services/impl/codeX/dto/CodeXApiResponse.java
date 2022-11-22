package algodebug.logic.compilator.services.impl.codeX.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CodeXApiResponse {
    private Boolean success;
    private LocalDateTime timestamp;
    private String output;
    private String error;
    private String language;
    private String version;
}
