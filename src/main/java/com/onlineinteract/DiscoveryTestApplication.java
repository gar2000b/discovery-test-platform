package com.onlineinteract;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAutoConfiguration()
public class DiscoveryTestApplication {

	public DiscoveryTestApplication() {
	}

	public static void main(String[] args) {
		SpringApplication.run(DiscoveryTestApplication.class, args);
	}
}