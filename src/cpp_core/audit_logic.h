#ifndef AUDIT_LOGIC_H
#define AUDIT_LOGIC_H

#include <string>
#include <vector>
using namespace std;

struct AuditLog {
    string auditId;
    string userId;
    string action;
    string createdAt;
};

bool appendLog(
    const string& connectionString,
    const string& userId,
    const string& action
);

vector<AuditLog> readLog(
    const string& connectionString,
    const string& userId
);

#endif