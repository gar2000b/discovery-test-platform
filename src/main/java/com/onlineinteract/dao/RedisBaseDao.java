package com.onlineinteract.dao;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

/**
 * Redis Base DAO
 * 
 * @author Gary Black
 *
 */
// @Repository
public class RedisBaseDao {

	public ValueOperations<String, Object> stringOperations;
	public HashOperations<String, String, String> hashOperations;
	public RedisTemplate<String, Object> redisTemplate;

	public RedisBaseDao(RedisTemplate<String, Object> redisTemplate) {
		this.redisTemplate = redisTemplate;
		hashOperations = redisTemplate.opsForHash();
	}

	// @PostConstruct
	// private void init() {
	// hashOperations = redisTemplate.opsForHash();
	// }
}
