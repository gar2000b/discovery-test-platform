package com.onlineinteract;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * 
 * Main entry point for the Discovery Test Platform (Spring Boot Application).
 * 
 * @author Gary Black
 *
 */

@SpringBootApplication
@EnableAutoConfiguration()
public class DiscoveryTestApplication {

	public static Connection databaseConnection;

	/**
	 * Main entry point.
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		connectDB();
		SpringApplication.run(DiscoveryTestApplication.class, args);
	}

	/**
	 * This POC version of the app makes use of a temporary local mySQL with dummy,
	 * default, throw away credentials. Subsequent revisions will abstract this
	 * away.
	 * 
	 * To replicate, spin up a new instance of MariaDB and update the first x4
	 * variables here. The schema for the current showcase is under
	 * src/main/resources/schema.
	 * 
	 * Details on the applications used during the showcase will appear in the
	 * dissertation paper.
	 */
	private static void connectDB() {
		String dbUrl = "192.168.0.30";
		String db = "loans";
		String username = "root";
		String password = "password";

		if (databaseConnection != null)
			return;

		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.out.println("Where is your MySQL JDBC Driver?");
			e.printStackTrace();
			return;
		}

		System.out.println("\nMySQL JDBC Driver Registered!");
		databaseConnection = null;

		try {
			databaseConnection = DriverManager.getConnection("jdbc:mysql://" + dbUrl + ":3306/" + db
					+ "?rewriteBatchedStatements=true&autoReconnect=true&useSSL=false", username, password);
		} catch (SQLException e) {
			e.printStackTrace();
		}

		if (databaseConnection != null) {
			System.out.println("You made it, take control of your database now!\n");
		} else {
			System.out.println("Failed to make connection!");
		}
	}

	/**
	 * As we are not using a DB connection pool, we use this quick keep alive method
	 * to ensure the DB operation is uninterrupted.
	 * 
	 * @throws SQLException
	 */
	@Scheduled(fixedRate = 20000)
	public void keepAlive() throws SQLException {
		Statement statement = DiscoveryTestApplication.databaseConnection.createStatement();
		statement.setQueryTimeout(60);
		statement.setFetchSize(1000);
		ResultSet rs = statement.executeQuery("SELECT 'PONG' AS PING;");
		rs.next();
		if (!rs.getString("PING").equals("PONG"))
			System.out.println("*** Problem - did not receive PONG from DB ***");

		rs.close();
		statement.close();
	}
}