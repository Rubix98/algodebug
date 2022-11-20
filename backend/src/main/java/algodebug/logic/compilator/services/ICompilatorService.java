package algodebug.logic.compilator.services;

import algodebug.logic.compilator.services.dto.CompilatorServiceRequest;
import algodebug.logic.compilator.services.dto.CompilatorServiceResponse;

public interface ICompilatorService {

    public CompilatorServiceResponse compile(CompilatorServiceRequest request);
}
