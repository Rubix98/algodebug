package algoview.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Service
public class CodeService {

    public String loadCode(String extension) {
        try {
            FileReader fileReader = new FileReader("src/main/resources/codes/Algo.cpp");
            BufferedReader reader = new BufferedReader(fileReader);
            String content = reader.lines().collect(Collectors.joining(System.lineSeparator()));
            return content;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
