package com.onlineinteract;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAutoConfiguration()
public class DiscoveryTestApplication {

	static Logger logger = LoggerFactory.getLogger(DiscoveryTestApplication.class);

	public DiscoveryTestApplication() {
	}

	public static void main(String[] args) {
		SpringApplication.run(DiscoveryTestApplication.class, args);
		logger.info("*** Discovery Test Platform now running ***");
	}
}