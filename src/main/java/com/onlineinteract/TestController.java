package com.onlineinteract;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

@Controller
public class TestController {
	
	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	
	TestController() {
	}

	@PostConstruct
	private void test() {
		logger.info("*** Discovery Test Platform now running (Post Construct) ***");
	}
}
