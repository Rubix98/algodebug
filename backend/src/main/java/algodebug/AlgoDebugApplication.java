package algodebug;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AlgoDebugApplication {

	public static void main(String[] args) {
		SpringApplication application = new SpringApplication(AlgoDebugApplication.class);
		application.setAdditionalProfiles("local");
		application.run(args);
	}

}
