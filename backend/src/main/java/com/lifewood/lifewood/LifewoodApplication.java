package com.lifewood.lifewood;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LifewoodApplication {

	public static void main(String[] args) {
		SpringApplication.run(LifewoodApplication.class, args);
	}

}
