package algoview.controllers;

import algoview.models.Project;
import algoview.services.CodeService;
import algoview.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("code")
public class CodeController {

    @Autowired
    CodeService codeService;

    @PostMapping("load/{extension}")
    public String load(@PathVariable String extension) {
        return codeService.loadCode(extension);
    }

}
