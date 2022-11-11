package algoview.compilator.models;

import algoview.compilator.models.BreakpointPojo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class OutputPojo {
    private String fullOutput;
    private List<String> partialOutputs;
    private List<BreakpointPojo> breakpoints;

    public OutputPojo(String fullOutput) {
        this.fullOutput = fullOutput;
        this.partialOutputs = new ArrayList<>();
        this.breakpoints = new ArrayList<>();
    }
}
