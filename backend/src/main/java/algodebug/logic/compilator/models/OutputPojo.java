package algodebug.logic.compilator.models;

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
    private List<FramePojo> frames;

    public OutputPojo(String fullOutput) {
        this.fullOutput = fullOutput;
        this.partialOutputs = new ArrayList<>();
        this.frames = new ArrayList<>();
    }
}
