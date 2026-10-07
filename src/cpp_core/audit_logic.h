#ifndef AUDIT_LOGIC_H
#define AUDIT_LOGIC_H

#include <string>
#include <vector>

struct AuditLog {
    std::string auditId;
    std::string userId;
    std::string action;
    std::string createdAt;
};

bool appendLog(
    const std::string& connectionString,
    const std::string& userId,
    const std::string& action
);

std::vector<AuditLog> readLog(
    const std::string& connectionString,
    const std::string& userId
);

std::vector<AuditLog> readAllLogs(
    const std::string& connectionString
);

#endif