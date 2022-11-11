package algoview.compilator.services.impl.codeX;

import algoview.compilator.services.ICompilatorService;
import algoview.compilator.services.dataBinds.CompilatorServiceRequest;
import algoview.compilator.services.dataBinds.CompilatorServiceResponse;
import algoview.compilator.services.impl.codeX.dataBinds.CodeXApiRequest;
import algoview.compilator.services.impl.codeX.dataBinds.CodeXApiResponse;
import algoview.compilator.utils.CompilatorUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CodeXCompilatorServiceImpl implements ICompilatorService {
    private static final String CODEX_API_URL = "https://codex-api.herokuapp.com/";
    private final RestTemplate restTemplate = new RestTemplate();

    public CompilatorServiceResponse compile(CompilatorServiceRequest request) {
        CodeXApiResponse response = restTemplate.postForObject(CODEX_API_URL, adaptRequest(request), CodeXApiResponse.class);
        System.out.println(response.getSuccess());
        return adaptResponse(response);
    }

    public static CodeXApiRequest adaptRequest(CompilatorServiceRequest request) {
        return new CodeXApiRequest(request.getCode(), request.getLanguage(), request.getInput());
    }

    public static CompilatorServiceResponse adaptResponse(CodeXApiResponse response) {
        return response.getSuccess() ?
                new CompilatorServiceResponse(response.getSuccess(), CompilatorUtils.parse(response.getOutput()), null) :
                new CompilatorServiceResponse(response.getSuccess(), null, response.getOutput());
    }
}
