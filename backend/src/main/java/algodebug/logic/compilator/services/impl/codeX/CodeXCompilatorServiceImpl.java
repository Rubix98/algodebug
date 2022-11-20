package algodebug.logic.compilator.services.impl.codeX;

import algodebug.logic.compilator.services.ICompilatorService;
import algodebug.logic.compilator.services.dto.CompilatorServiceRequest;
import algodebug.logic.compilator.services.dto.CompilatorServiceResponse;
import algodebug.logic.compilator.services.impl.codeX.dto.CodeXApiRequest;
import algodebug.logic.compilator.services.impl.codeX.dto.CodeXApiResponse;
import algodebug.logic.compilator.utils.CompilatorUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CodeXCompilatorServiceImpl implements ICompilatorService {
    private static final String CODEX_API_URL = "https://codex-api.herokuapp.com/";
    private final RestTemplate restTemplate = new RestTemplate();

    public CompilatorServiceResponse compile(CompilatorServiceRequest request) {
        CodeXApiResponse response = restTemplate.postForObject(CODEX_API_URL, adaptRequest(request), CodeXApiResponse.class);
        return adaptResponse(response);
    }

    public static CodeXApiRequest adaptRequest(CompilatorServiceRequest request) {
        return new CodeXApiRequest(request.getCode(), request.getLanguage(), request.getInput());
    }

    public static CompilatorServiceResponse adaptResponse(CodeXApiResponse response) {
        return response.getSuccess() ?
                new CompilatorServiceResponse(response.getSuccess(), CompilatorUtils.parse(response.getOutput()), null) :
                new CompilatorServiceResponse(response.getSuccess(), null, response.getError());
    }
}
