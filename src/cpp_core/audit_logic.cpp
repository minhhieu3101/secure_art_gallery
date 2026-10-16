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

    txn.exec_params(
        "INSERT INTO public.audit_logs "
        "(audit_id, user_id, action, created_at) "
        "VALUES (gen_random_uuid()::text, $1, $2, NOW())",
        userId,
        action
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

    auto result = txn.exec_params(
        "SELECT a.audit_id, a.user_id, u.email, "
        "a.action, a.created_at "
        "FROM public.audit_logs AS a "
        "LEFT JOIN public.\"user\" AS u "
        "ON a.user_id = u.id::text "
        "WHERE a.user_id = $1 "
        "ORDER BY a.created_at DESC",
        userId
    );

    std::vector<AuditLog> logs;

    for (const auto& row : result) {
        AuditLog log;

        log.auditId = row["audit_id"].as<std::string>();
        log.userId = row["user_id"].as<std::string>();
        log.email = row["email"].is_null()
            ? "Unknown user"
            : row["email"].as<std::string>();
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
        "SELECT a.audit_id, a.user_id, u.email, "
        "a.action, a.created_at "
        "FROM public.audit_logs AS a "
        "LEFT JOIN public.\"user\" AS u "
        "ON a.user_id = u.id::text "
        "ORDER BY a.created_at DESC"
    );

    std::vector<AuditLog> logs;

    for (const auto& row : result) {
        AuditLog log;

        log.auditId = row["audit_id"].as<std::string>();
        log.userId = row["user_id"].as<std::string>();
        log.email = row["email"].is_null()
            ? "Unknown user"
            : row["email"].as<std::string>();
        log.action = row["action"].as<std::string>();
        log.createdAt = row["created_at"].as<std::string>();

        logs.push_back(log);
    }

    return logs;
}