#include <napi.h>
#include "audit_logic.h"

// Wrapper cho appendLog()
Napi::Value AppendLogWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 3 ||
        !info[0].IsString() ||
        !info[1].IsString() ||
        !info[2].IsString()) {

        Napi::TypeError::New(
            env,
            "Expected connectionString, userId, action"
        ).ThrowAsJavaScriptException();

        return env.Null();
    }

    std::string connectionString =
        info[0].As<Napi::String>().Utf8Value();

    std::string userId =
        info[1].As<Napi::String>().Utf8Value();

    std::string action =
        info[2].As<Napi::String>().Utf8Value();

    try {
        appendLog(
            connectionString,
            userId,
            action
        );

        return Napi::Boolean::New(env, true);

    } catch (const std::exception& e) {

        Napi::Error::New(env, e.what())
            .ThrowAsJavaScriptException();

        return env.Null();
    }
}


// Wrapper cho readLog()
Napi::Value ReadLogWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2 ||
        !info[0].IsString() ||
        !info[1].IsString()) {

        Napi::TypeError::New(
            env,
            "Expected connectionString, userId"
        ).ThrowAsJavaScriptException();

        return env.Null();
    }

    std::string connectionString =
        info[0].As<Napi::String>().Utf8Value();

    std::string userId =
        info[1].As<Napi::String>().Utf8Value();

    try {
        auto logs = readLog(
            connectionString,
            userId
        );

        Napi::Array result =
            Napi::Array::New(env, logs.size());

        for (size_t i = 0; i < logs.size(); i++) {

            Napi::Object item =
                Napi::Object::New(env);

            item.Set(
                "auditId",
                logs[i].auditId
            );

            item.Set(
                "userId",
                logs[i].userId
            );

            item.Set(
                "action",
                logs[i].action
            );

            item.Set(
                "createdAt",
                logs[i].createdAt
            );

            result.Set(i, item);
        }

        return result;

    } catch (const std::exception& e) {

        Napi::Error::New(env, e.what())
            .ThrowAsJavaScriptException();

        return env.Null();
    }
}


// Wrapper cho readAllLogs()
Napi::Value ReadAllLogsWrapped(
    const Napi::CallbackInfo& info
) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 ||
        !info[0].IsString()) {

        Napi::TypeError::New(
            env,
            "Expected connectionString"
        ).ThrowAsJavaScriptException();

        return env.Null();
    }

    std::string connectionString =
        info[0].As<Napi::String>().Utf8Value();

    try {
        auto logs = readAllLogs(
            connectionString
        );

        Napi::Array result =
            Napi::Array::New(env, logs.size());

        for (size_t i = 0; i < logs.size(); i++) {

            Napi::Object item =
                Napi::Object::New(env);

            item.Set(
                "auditId",
                logs[i].auditId
            );

            item.Set(
                "userId",
                logs[i].userId
            );

            item.Set(
                "action",
                logs[i].action
            );

            item.Set(
                "createdAt",
                logs[i].createdAt
            );

            result.Set(i, item);
        }

        return result;

    } catch (const std::exception& e) {

        Napi::Error::New(env, e.what())
            .ThrowAsJavaScriptException();

        return env.Null();
    }
}


// Đăng ký module
Napi::Object Init(
    Napi::Env env,
    Napi::Object exports
) {
    exports.Set(
        "appendLog",
        Napi::Function::New(
            env,
            AppendLogWrapped
        )
    );

    exports.Set(
        "readLog",
        Napi::Function::New(
            env,
            ReadLogWrapped
        )
    );

    exports.Set(
        "readAllLogs",
        Napi::Function::New(
            env,
            ReadAllLogsWrapped
        )
    );

    return exports;
}

NODE_API_MODULE(audit, Init)