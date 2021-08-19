package com.onlineinteract.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis Configuration
 * 
 * @author Gary Black
 *
 */
@Configuration
@ComponentScan("com.onlineinteract")
public class RedisConfig {

	private static final String REDIS_HOST = "kevin";
	private static final int REDIS_PORT = 6379;
	private static final int REDIS_DATABASE = 1;

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	/**
	 * Create new JedisConnectionFactory bean.
	 * 
	 * @return JedisConnectionFactory
	 */
	@Bean
	JedisConnectionFactory jedisConnectionFactory() {
		RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration();
		configuration.setHostName(REDIS_HOST);
		configuration.setPort(REDIS_PORT);
		configuration.setDatabase(REDIS_DATABASE);

		logger.info("**** using database: " + REDIS_DATABASE + " ****");

		JedisConnectionFactory jedisConFactory = new JedisConnectionFactory(configuration);
		return jedisConFactory;
	}

	/**
	 * Create new RedisTemplate bean.
	 * 
	 * @return RedisTemplate
	 */
	@Bean
	public RedisTemplate<String, Object> redisTemplate() {
		logger.info("**** redisTemplate() ****");
		final RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
		template.setConnectionFactory(jedisConnectionFactory());
		template.setDefaultSerializer(new StringRedisSerializer());
		return template;
	}
}
