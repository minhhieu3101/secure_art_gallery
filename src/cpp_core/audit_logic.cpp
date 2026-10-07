#include "audit_logic.h"
#include <pqxx/pqxx>
#include <stdexcept>

bool appendLog(
    const std::string& connectionString,
    const std::string& userId,
    const std::string& action
) {
    pqxx::connection conn(connectionString);
    pqxx::work txn(conn);

    txn.exec(
        "INSERT INTO audit_logs "
        "(audit_id, user_id, action, created_at) "
        "VALUES (gen_random_uuid()::text, $1, $2, NOW())",
        pqxx::params{userId, action}
    );

    txn.commit();

    return true;
}

std::vector<AuditLog> readLog(
    const std::string& connectionString,
    const std::string& userId
) {
    pqxx::connection conn(connectionString);
    pqxx::read_transaction txn(conn);

    auto result = txn.exec(
        "SELECT audit_id, user_id, action, created_at "
        "FROM audit_logs "
        "WHERE user_id = $1 "
        "ORDER BY created_at DESC",
        pqxx::params{userId}
    );

    std::vector<AuditLog> logs;

    for (const auto& row : result) {
        AuditLog log;

        log.auditId = row["audit_id"].as<std::string>();
        log.userId = row["user_id"].as<std::string>();
        log.action = row["action"].as<std::string>();
        log.createdAt = row["created_at"].as<std::string>();

        logs.push_back(log);
    }

    return logs;
}

std::vector<AuditLog> readAllLogs(
    const std::string& connectionString
) {
    pqxx::connection conn(connectionString);
    pqxx::read_transaction txn(conn);

    auto result = txn.exec(
        "SELECT audit_id, user_id, action, created_at "
        "FROM audit_logs "
        "ORDER BY created_at DESC"
    );

    std::vector<AuditLog> logs;

    for (const auto& row : result) {
        AuditLog log;

        log.auditId = row["audit_id"].as<std::string>();
        log.userId = row["user_id"].as<std::string>();
        log.action = row["action"].as<std::string>();
        log.createdAt = row["created_at"].as<std::string>();

        logs.push_back(log);
    }

    return logs;
}