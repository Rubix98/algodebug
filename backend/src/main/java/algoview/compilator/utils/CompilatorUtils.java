package algoview.compilator.utils;

import algoview.compilator.models.BreakpointPojo;
import algoview.compilator.models.OutputPojo;
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
            output.getBreakpoints().add(parseBreakpoint(breakpointText));

            position = breakpointEndPosition;
        }

        return output;
    }

    private static BreakpointPojo parseBreakpoint(String breakpointText) {
        Document breakpointDoc = Jsoup.parse(breakpointText);
        int line = Integer.parseInt(breakpointDoc.select("algodebug-breakpoint").get(0).attr("line"));
        Map<String, String> variables = breakpointDoc.select("algodebug-variable").stream()
                .map(variable -> new AbstractMap.SimpleEntry<>(variable.attr("name"), variable.text()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (prev, next) -> next, HashMap::new));
        return new BreakpointPojo(line, variables);
    }
}
