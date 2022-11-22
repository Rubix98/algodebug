package algodebug.logic.compilator.utils;

import algodebug.logic.compilator.models.FramePojo;
import algodebug.logic.compilator.models.OutputPojo;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.util.*;
import java.util.stream.Collectors;

public class CompilatorUtils {
    private static final String BREAKPOINT_BEGIN_TAG = "<algodebug-breakpoint";
    private static final String BREAKPOINT_END_TAG = "</algodebug-breakpoint>\n";

    public static OutputPojo parse(String outputText) {
        OutputPojo output = new OutputPojo(outputText);

        int position = 0;
        while (position < outputText.length()) {
            int breakpointStartPosition = outputText.indexOf(BREAKPOINT_BEGIN_TAG, position);
            if (breakpointStartPosition != -1) {
                output.getPartialOutputs().add(outputText.substring(position, breakpointStartPosition));
            } else {
                output.getPartialOutputs().add(outputText.substring(position));
                break;
            }

            int breakpointEndPosition = outputText.indexOf(BREAKPOINT_END_TAG, breakpointStartPosition) + BREAKPOINT_END_TAG.length();
            String breakpointText = outputText.substring(breakpointStartPosition, breakpointEndPosition);
            output.getFrames().add(parseFrame(breakpointText));

            position = breakpointEndPosition;
        }

        addIndexesToFrames(output);
        return output;
    }

    private static FramePojo parseFrame(String breakpointText) {
        Document breakpointDoc = Jsoup.parse(breakpointText);
        int line = Integer.parseInt(breakpointDoc.select("algodebug-breakpoint").get(0).attr("line"));
        Map<String, String> variables = breakpointDoc.select("algodebug-variable").stream()
                .map(variable -> new AbstractMap.SimpleEntry<>(variable.attr("name"), variable.wholeOwnText()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (prev, next) -> next, HashMap::new));
        return new FramePojo(line, variables);
    }

    private static void addIndexesToFrames(OutputPojo output) {
        for (int i = 0; i < output.getFrames().size(); i++) {
            output.getFrames().get(i).setId(i);
        }
    }
}
