package com.onlineinteract.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;

import com.onlineinteract.dao.ProjectDao;
import com.onlineinteract.dao.impl.RedisProjectDaoImpl;

/**
 * Configure the JDBC DAO implementations.
 * 
 * @author Gary Black
 *
 */
@Configuration
public class ConfigureDao {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	@Bean(name = ConfigConstants.PROJECT_DAO)
	public ProjectDao projectDao() {
		if (logger.isDebugEnabled()) {
			logger.debug("Configuring bean projectDao");
		}

		RedisProjectDaoImpl redisProjectDaoImpl = new RedisProjectDaoImpl(redisTemplate);
		logger.info("*** returning redisProjectDaoImpl");
		return redisProjectDaoImpl;
	}
}
