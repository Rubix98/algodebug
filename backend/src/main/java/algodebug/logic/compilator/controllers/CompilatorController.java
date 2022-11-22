package algodebug.logic.compilator.controllers;

import algodebug.logic.compilator.controllers.dto.CompilatorRequest;
import algodebug.logic.compilator.controllers.dto.CompilatorResponse;
import algodebug.logic.compilator.services.ICompilatorService;
import algodebug.logic.compilator.services.dto.CompilatorServiceRequest;
import algodebug.logic.compilator.services.dto.CompilatorServiceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("compilator")
public class CompilatorController {
    @Autowired
    private ICompilatorService compilatorService;

    @PostMapping("compile")
    public CompilatorResponse compile(@RequestBody CompilatorRequest request) {
        System.out.println("compilator/compile");
        List<CompilatorServiceResponse> responseList = request.getInputs().stream()
                .map(input -> new CompilatorServiceRequest(request.getCode(), request.getLanguage(), input))
                .map(req -> compilatorService.compile(req))
                .collect(Collectors.toList());
        Boolean success = responseList.stream().allMatch(CompilatorServiceResponse::getSuccess);
        return new CompilatorResponse(success, responseList);
    }
}


