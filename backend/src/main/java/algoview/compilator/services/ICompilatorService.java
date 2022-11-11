package algoview.compilator.services;

import algoview.compilator.services.dataBinds.CompilatorServiceRequest;
import algoview.compilator.services.dataBinds.CompilatorServiceResponse;

public interface ICompilatorService {

    public CompilatorServiceResponse compile(CompilatorServiceRequest request);
}
