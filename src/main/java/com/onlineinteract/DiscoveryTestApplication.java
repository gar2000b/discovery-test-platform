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

@SpringBootApplication
@EnableAutoConfiguration()
public class DiscoveryTestApplication {
	
	public static Connection databaseConnection;

	public DiscoveryTestApplication() {
	}

	public static void main(String[] args) {
		connectDB();
		SpringApplication.run(DiscoveryTestApplication.class, args);
	}
	
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