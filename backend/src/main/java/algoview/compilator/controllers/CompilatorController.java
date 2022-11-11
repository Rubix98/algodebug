package algoview.compilator.controllers;

import algoview.compilator.controllers.dataBinds.CompilatorRequest;
import algoview.compilator.controllers.dataBinds.CompilatorResponse;
import algoview.compilator.services.ICompilatorService;
import algoview.compilator.services.dataBinds.CompilatorServiceRequest;
import algoview.compilator.services.dataBinds.CompilatorServiceResponse;
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
        System.out.println(request.getLanguage());
        List<CompilatorServiceResponse> responseList = request.getInputs().stream()
                .map(input -> new CompilatorServiceRequest(request.getCode(), request.getLanguage(), input))
                .map(req -> compilatorService.compile(req)).collect(Collectors.toList());
        Boolean success = responseList.stream().allMatch(CompilatorServiceResponse::getSuccess);

        //responseList.forEach(response -> System.out.println(response.getOutput().getFullOutput()));
        System.out.println(success);
        return new CompilatorResponse(success, responseList);
    }
}


